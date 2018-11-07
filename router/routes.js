const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://" + "304group" + ":" + "rohan" +  "@localhost:" + "5433" + "/marketWatch";
var client = new pg.Client(connectionString);
client.connect();

let leaderBoard = `CREATE TABLE IF NOT EXISTS LeaderBoard(LeaderBoardID VARCHAR(10) NOT NULL, numOfTraders INTEGER)`;
let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARHCAR(10) NOT NULL funds MONEY, tradername VARCHAR(12) UNIQUE, portfolioid`
let isOn = `CREATE TABLE IF NOT EXISTS ison(leaderboardid VARCHAR(10) NOT NULL, traderid VARCHAR(10) NOT NULL, rank INTEGER, PRIMARY KEY (leaderboardid, traderid), FOREIGN KEY (leaderboardID) REFERENCES leaderboard(leaderboardID), FOREIGN KEY (traderid) REFERENCES trader(traderID))`;
client.query(leaderBoard , (err, res) => {
    if (err) {
        console.log("ERROR: " + err);
    } else {
        console.log("User table created");
    }
});

client.query(isOn, (err, res) =>{
    console.log(err);
    console.log(res);
})

let select = `SELECT * FROM leaderBoard`;
client.query(select, (err, res) => {
    if (err) {

    } else {
        console.log(res);
    }
})

//connection.query("SELECT * from temp", function( err, results, fields) {})
// router.get("/", (req, res) => {
// });

module.exports = router;