const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://304group:rohan@localhost:5433/marketWatch";
var client = new pg.Client(connectionString);
client.connect();

let price = `CREATE TABLE IF NOT EXISTS price(priceID VARCHAR(10) NOT NULL PRIMARY KEY, pDate VARCHAR(100), value INTEGER)`;
let company = `CREATE TABLE IF NOT EXISTS company(companyID VARCHAR(4) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(32), companyName VARCHAR(32), priceID VARCHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;
let leaderBoard = `CREATE TABLE IF NOT EXISTS leaderboard(leaderboardID VARCHAR(10) NOT NULL PRIMARY KEY, numOfTraders INTEGER)`;
let isOn = `CREATE TABLE IF NOT EXISTS ison(leaderboardID VARCHAR(10) NOT NULL, traderID VARCHAR(10) NOT NULL, rank INTEGER, PRIMARY KEY (leaderboardID, traderID), FOREIGN KEY (leaderboardID) REFERENCES leaderboard(leaderboardID), FOREIGN KEY (traderID) REFERENCES trader(traderID))`;
let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARCHAR(10) NOT NULL PRIMARY KEY, funds MONEY, traderName VARCHAR(12) UNIQUE, portfolioID CHAR(10) NOT NULL, FOREIGN KEY (portfolioID) REFERENCES portfolio ON DELETE CASCADE ON UPDATE CASCADE)`;
let portfolio = `CREATE TABLE IF NOT EXISTS portfolio(portfolioID VARCHAR(10) NOT NULL PRIMARY KEY)`;
let watchList = `CREATE TABLE IF NOT EXISTS watchlist(watchlistID VARCHAR(10) NOT NULL PRIMARY KEY, traderID VARCHAR(10), FOREIGN KEY (traderID) REFERENCES trader ON DELETE SET NULL ON UPDATE CASCADE)`;
let includes = `CREATE TABLE IF NOT EXISTS includes(watchlistID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, PRIMARY KEY (companyID, watchlistID), FOREIGN KEY (watchlistID) REFERENCES watchlist(watchlistID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let contains = `CREATE TABLE IF NOT EXISTS contains(portfolioID VARCHAR(10) NOT NULL, companyID CHAR(4), PRIMARY KEY (portfolioID, companyID), FOREIGN KEY (portfolioID) REFERENCES portfolio(portfolioID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let transaction = `CREATE TABLE IF NOT EXISTS transaction(transactionID VARCHAR(10) PRIMARY KEY, traderID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, priceID VARCHAR(10) NOT NULL, type BIT(1), sharesPurchased INTEGER, FOREIGN KEY (traderID) REFERENCES trader(traderID) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (priceID) REFERENCES price(priceID) ON DELETE NO ACTION ON UPDATE CASCADE)`;

let arr = [price, company, leaderBoard, portfolio, trader, isOn, watchList, includes, contains, transaction];

arr.forEach((query) => {
    client.query(query, (err, result) => {
        if (err) {
            console.log(query + err);
        } else {
            console.log(result);
        }
    })
});


// get price from company(priceID)
// add transaction row
// update trader funds
// check includes table and update if necessary
// update isOn based on funds
// add to contains if doesn't already exist
router.post("/buy", (req, res) => {
    let price = req.body.price;
    let PID = createPriceEntry(price, res);
    let TID = req.body.traderID;
    let CID = req.body.companyID;
    let TXID = generateID();
    let numOfShares = req.body.numOfShares;
    let addTX = `INSERT INTO transaction(transactionID, traderID, companyID, priceID, type, sharesPurchased) values($1, $2, $3, $4, $5, $6)`;
    client.query(addTX, [TXID, TID, CID, PID, 1, numOfShares]);

});

router.post('/sell', (req, res) => {

});

generateID = function() {
    let id = Math.floor((Math.random()*1000)).toString();
    return id;
}

//TODO
router.post('/addToWatchList', (req, res) => {

});

//TODO
// add trader to leaderboard
// update numofplayers on leaderboard table
// create portfolio row
// assign porfolio row to trader
router.post("/addTrader", (req, res) => {
    let addTrader = `INSERT INTO trader(traderID, funds, tradername, portfolioID) values($1, $2, $3, $4)`;
    let TID = generateID();
    let PortID = generateID();
    client.query(addTrader, [TID, 300000, "rohan is a baller", PortID]);
    res.send("trader added");
});

//returns top 5 players on the leaderboard
router.get("/getTopPlayers", (req, res) => {

});



//Below are for testing


router.get("/getPrice/:id", (req, res) => {
    let id = req.params.id;
    let select = `SELECT * FROM price WHERE priceID = $1`;
    client.query(select, [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    })
});

router.get("/getCompany/:id", (req, res) => {
    let id = req.params.id;
    let select = `SELECT * FROM company WHERE companyID = $1`;
    client.query(select, [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    })
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

createPriceEntry = function(price) {
    return new Promise((resolve, reject) => {
        let id = generateID();
        let date = new Date();
        let addPrice = `INSERT INTO price(priceID, pDate, value) values($1, $2, $3)`;
        client.query(addPrice, [id, date.toString(), price], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    }) 
}

router.get("/addRows", (req, res) => {
    let addQuery = `INSERT INTO company(companyID, numOfShares, industry, companyName, priceID) values($1, $2, $3, $4, $5)`;

    createPriceEntry(58).then((id) => {
        client.query(addQuery, ["APPL", 50, "Tech", "Apple", id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    })

    createPriceEntry(150).then((id1) => {
        client.query(addQuery, ["GOOG", 25, "Tech", "Google", id1], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });    
    })
    res.send();
});

module.exports = router;