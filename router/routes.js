const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://" + "304group" + ":" + "rohan" +  "@localhost:" + "5433" + "/marketWatch";
var client = new pg.Client(connectionString);
client.connect();

let price = `CREATE TABLE IF NOT EXISTS price(priceID VARCHAR(10) NOT NULL PRIMARY KEY, pDate VARCHAR(100), value INTEGER)`;
let stock = `CREATE TABLE IF NOT EXISTS company(companyID VARCHAR(4) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(32), companyName VARCHAR(32), priceID VARCHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;
let leaderBoard = `CREATE TABLE IF NOT EXISTS leaderboard(leaderboardID VARCHAR(10) NOT NULL PRIMARY KEY, numOfTraders INTEGER)`;
let isOn = `CREATE TABLE IF NOT EXISTS ison(leaderboardID VARCHAR(10) NOT NULL, traderID VARCHAR(10) NOT NULL, rank INTEGER, PRIMARY KEY (leaderboardID, traderID), FOREIGN KEY (leaderboardID) REFERENCES leaderboard(leaderboardID), FOREIGN KEY (traderID) REFERENCES trader(traderID))`;
let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARCHAR(10) NOT NULL PRIMARY KEY, funds MONEY, traderName VARCHAR(12) UNIQUE, portfolioID CHAR(10) NOT NULL, FOREIGN KEY (portfolioID) REFERENCES portfolio ON DELETE CASCADE ON UPDATE CASCADE)`;
let portfolio = `CREATE TABLE IF NOT EXISTS portfolio(portfolioID VARCHAR(10) NOT NULL PRIMARY KEY)`;
let watchList = `CREATE TABLE IF NOT EXISTS watchlist(watchlistID VARCHAR(10) NOT NULL PRIMARY KEY, traderID VARCHAR(10), FOREIGN KEY (traderID) REFERENCES trader ON DELETE SET NULL ON UPDATE CASCADE)`;
let includes = `CREATE TABLE IF NOT EXISTS includes(watchlistID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, PRIMARY KEY (companyID, watchlistID), FOREIGN KEY (watchlistID) REFERENCES watchlist(watchlistID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let contains = `CREATE TABLE IF NOT EXISTS contains(portfolioID VARCHAR(10) NOT NULL, companyID CHAR(4), PRIMARY KEY (portfolioID, companyID), FOREIGN KEY (portfolioID) REFERENCES portfolio(portfolioID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let transaction = `CREATE TABLE IF NOT EXISTS transaction(transactionID VARCHAR(10) PRIMARY KEY, traderID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, priceID VARCHAR(10) NOT NULL, type BIT, sharesPurchased INTEGER, FOREIGN KEY (traderID) REFERENCES trader(traderID) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (priceID) REFERENCES price(priceID) ON DELETE NO ACTION ON UPDATE CASCADE)`;

let arr = [price, stock, leaderBoard, portfolio, trader, isOn, watchList, includes, contains, transaction];

arr.forEach((query) => {
    client.query(query, (err, result) => {
        if (err) {
            console.log(query + err);
        } else {
            console.log(result);
        }
    })
});

router.get("/buy", (req, res) => {
    let company = req.body.company;
    let trader = req.body.trader;
    let price = req.body.price;
    let id = createPriceEntry(price, res);
    console.log("/buy called");
});

createPriceEntry = function(price, res) {
    let id = Math.floor((Math.random()*1000)).toString();
    let date = new Date();
    let addPrice = `INSERT INTO price(priceID, pDate, value) values($1, $2, $3)`;
    client.query(addPrice, [id, date.toString(), price], (err, result) => {
        if (err) {
            res.status(400, {error: err});
        } else {
            return id;
        }
    });
}

router.get("/getPrice", (req, res) => {
    let select = `SELECT * FROM price`;
    client.query(select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

router.get("/getCompany", (req, res) => {
    let select = `SELECT * FROM company`;
    client.query(select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

router.get("/addRows" , (req, res) => {
    let addQuery = `INSERT INTO company(companyID, numOfShares, industry, companyName, priceID) values($1, $2, $3, $4, $5)`;
    let addPrice = `INSERT INTO price(priceID, pDate, value) values($1, $2, $3)`;
    let date = new Date();
    let id = Math.floor((Math.random()*1000 + 1));
    id = id.toString();
    client.query(addPrice, [id, date.toString(), 58], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    
    let id1 = Math.floor((Math.random()*1000)).toString();
    client.query(addPrice, [id1, date.toString(), 150], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    
    client.query(addQuery, ["APPL", 50, "Tech", "Apple", id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    
    client.query(addQuery, ["GOOG", 25, "Tech", "Google", id1], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });    
    res.send();
});

module.exports = router;