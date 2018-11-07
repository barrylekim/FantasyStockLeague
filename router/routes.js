const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://" + "postgres" + ":" + "temp123" +  "@localhost:" + "5433" + "/postgres";
var client = new pg.Client(connectionString);
client.connect();

let createTableQuery = `CREATE TABLE IF NOT EXISTS users(email VARCHAR(40) UNIQUE NOT NULL, password VARCHAR(40) NOT NULL, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL)`;
client.query(createTableQuery , (err, res) => {
    if (err) {
        console.log("ERROR: " + err);
    } else {
        console.log("User table created");
    }
});

//connection.query("SELECT * from temp", function( err, results, fields) {})
// router.get("/", (req, res) => {
// });

module.exports = router;