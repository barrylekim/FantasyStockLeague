const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://" + "304group" + ":" + "rohan" +  "@localhost:" + "5433" + "/marketWatch";
var client = new pg.Client(connectionString);
client.connect();

let price = `CREATE TABLE IF NOT EXISTS price(priceID CHAR(10) NOT NULL PRIMARY KEY, pDate INTEGER, pTime INTEGER, value INTEGER)`;
let stock = `CREATE TABLE IF NOT EXISTS company(companyID CHAR(4) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(32), companyName VARCHAR(32), priceID CHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;
let leaderBoard = `CREATE TABLE IF NOT EXISTS leaderboard(leaderboardID CHAR(10) NOT NULL PRIMARY KEY, numOfTraders INTEGER)`;
let isOn = `CREATE TABLE IF NOT EXISTS ison(leaderboardID CHAR(10) NOT NULL, traderID CHAR(10) NOT NULL, rank INTEGER, PRIMARY KEY (leaderboardID, traderID), FOREIGN KEY (leaderboardID) REFERENCES leaderboard(leaderboardID), FOREIGN KEY (traderID) REFERENCES trader(traderID))`;
let trader = `CREATE TABLE IF NOT EXISTS trader(traderID CHAR(10) NOT NULL PRIMARY KEY, funds MONEY, traderName VARCHAR(12) UNIQUE, portfolioID INTEGER NOT NULL, FOREIGN KEY (portfolioID) REFERENCES portfolio ON DELETE CASCADE ON UPDATE CASCADE)`;
let portfolio = `CREATE TABLE IF NOT EXISTS portfolio(portfolioID INTEGER NOT NULL PRIMARY KEY)`;
let watchList = `CREATE TABLE IF NOT EXISTS watchlist(watchlistID INTEGER NOT NULL PRIMARY KEY, traderID CHAR(10), FOREIGN KEY (traderID) REFERENCES trader ON DELETE SET NULL ON UPDATE CASCADE)`;
let includes = `CREATE TABLE IF NOT EXISTS includes(watchlistID INTEGER NOT NULL, companyID CHAR(4) NOT NUlL, PRIMARY KEY (companyID, watchlistID), FOREIGN KEY (watchlistID) REFERENCES watchlist(watchlistID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let contains = `CREATE TABLE IF NOT EXISTS contains(portfolioID INTEGER NOT NULL, companyID CHAR(4), PRIMARY KEY (portfolioID, companyID), FOREIGN KEY (portfolioID) REFERENCES portfolio(portfolioID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let transaction = `CREATE TABLE IF NOT EXISTS transaction(transactionID CHAR(10) PRIMARY KEY, traderID CHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, priceID CHAR(10) NOT NULL, type BIT, sharesPurchased INTEGER, FOREIGN KEY (traderID) REFERENCES trader(traderID) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (priceID) REFERENCES price(priceID) ON DELETE NO ACTION ON UPDATE CASCADE)`;

let arr = [price, stock, leaderBoard, isOn, portfolio, trader, watchList, includes, contains, transaction];

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
    console.log("/buy called");
});

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
    let addPrice = `INSERT INTO price(priceID, pDate, pTime, value) values($1, $2, $3, $4)`;
    
    client.query(addPrice, ["123", 7, 4, 58], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    
    client.query(addPrice, ["1279", 5, 8, 150], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    
    client.query(addQuery, ["APPL", 50, "Tech", "Apple", "123"], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    
    client.query(addQuery, ["GOOG", 25, "Tech", "Google", "1279"], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });    
});

module.exports = router;

// let arr = [leaderBoard, trader, isOn]; 
// client.query(leaderBoard , (err, res) => {
//     if (err) {
//         console.log("ERROR: " + err);
//     } else {
//         console.log("User table created");
//     }
// });

// client.query(isOn, (err, res) =>{
//     console.log(err);
//     console.log(res);
// })

// let select = `SELECT * FROM leaderBoard`;
// client.query(select, (err, res) => {
//     if (err) {

//     } else {
//         console.log(res);
//     }
// });

// //connection.query("SELECT * from temp", function( err, results, fields) {})
// // router.get("/", (req, res) => {
// // });
