const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://" + "304group" + ":" + "rohan" +  "@localhost:" + "5433" + "/marketWatch";
var client = new pg.Client(connectionString);
client.connect();

let price = `CREATE TABLE IF NOT EXISTS price(priceID VARCHAR(10) NOT NULL PRIMARY KEY, pDate INTEGER, pTime INTEGER, value INTEGER)`;
let stock = `CREATE TABLE IF NOT EXISTS company(companyID VARCHAR(4) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(32), companyName VARCHAR(32), priceID VARCHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;

let arr = [price, stock];

arr.forEach((query) => {
    client.query(query, (err, result) => {
        if (err) {
            console.log(query + err);
        } else {
            console.log(result);
        }
    })
});

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

router.get("/buy", (req, res) => {
    console.log("/buy called");
});

router.get("/getPrice", (req, res) => {
    let select = `SELECT * FROM price`;
    client.query(select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

router.get("/getCompany", (req, res) => {
    let select = `SELECT * FROM company`;
    client.query(select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;


// let leaderBoard = `CREATE TABLE IF NOT EXISTS LeaderBoard(LeaderBoardID VARCHAR(10) NOT NULL, numOfTraders INTEGER)`;
// let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARHCAR(10) NOT NULL funds MONEY, tradername VARCHAR(12) UNIQUE, portfolioid`
// let isOn = `CREATE TABLE IF NOT EXISTS ison(leaderboardid VARCHAR(10) NOT NULL, traderid VARCHAR(10) NOT NULL, rank INTEGER, PRIMARY KEY (leaderboardid, traderid), FOREIGN KEY (leaderboardID) REFERENCES leaderboard(leaderboardID), FOREIGN KEY (traderid) REFERENCES trader(traderID))`;

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
