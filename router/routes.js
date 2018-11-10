const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://304group:rohan@localhost:5433/marketWatch";
var client = new pg.Client(connectionString);
client.connect();

let price = `CREATE TABLE IF NOT EXISTS price(priceID VARCHAR(10) NOT NULL PRIMARY KEY, pDate VARCHAR(100), value INTEGER)`;
let company = `CREATE TABLE IF NOT EXISTS company(companyID VARCHAR(4) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(32), companyName VARCHAR(32), priceID VARCHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;
let leaderBoard = `CREATE TABLE IF NOT EXISTS leaderboard(leaderboardID VARCHAR(10) NOT NULL PRIMARY KEY, numOfTraders INTEGER)`;
let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARCHAR(10) NOT NULL PRIMARY KEY, funds MONEY, traderName VARCHAR(12) UNIQUE, leaderboardID VARCHAR(10) NOT NULL, portfolioID CHAR(10) NOT NULL, FOREIGN KEY (portfolioID) REFERENCES portfolio ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (leaderboardID) REFERENCES leaderboard ON DELETE CASCADE ON UPDATE CASCADE)`;
let portfolio = `CREATE TABLE IF NOT EXISTS portfolio(portfolioID VARCHAR(10) NOT NULL PRIMARY KEY)`;
let watchList = `CREATE TABLE IF NOT EXISTS watchlist(watchlistID VARCHAR(10) NOT NULL PRIMARY KEY, traderID VARCHAR(10), FOREIGN KEY (traderID) REFERENCES trader ON DELETE SET NULL ON UPDATE CASCADE)`;
let includes = `CREATE TABLE IF NOT EXISTS includes(watchlistID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, PRIMARY KEY (companyID, watchlistID), FOREIGN KEY (watchlistID) REFERENCES watchlist(watchlistID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let contains = `CREATE TABLE IF NOT EXISTS contains(portfolioID VARCHAR(10) NOT NULL, companyID CHAR(4), PRIMARY KEY (portfolioID, companyID), FOREIGN KEY (portfolioID) REFERENCES portfolio(portfolioID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
let transaction = `CREATE TABLE IF NOT EXISTS transaction(transactionID VARCHAR(10) PRIMARY KEY, traderID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, priceID VARCHAR(10) NOT NULL, type BIT(1), sharesPurchased INTEGER, FOREIGN KEY (traderID) REFERENCES trader(traderID) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (priceID) REFERENCES price(priceID) ON DELETE NO ACTION ON UPDATE CASCADE)`;

let arr = [price, company, leaderBoard, portfolio, trader, watchList, includes, contains, transaction];

arr.forEach((query) => {
    client.query(query, (err, result) => {
        if (err) {
            console.log(query + err);
        } else {
            console.log(result);
        }
    })
});

// given companyID and traderID
// get price from company(priceID)
// add transaction row
// update trader funds
// check contains table and update if necessary
// update isOn based on funds
// add to contains if doesn't already exist
router.post("/buy", (req, res) => {
    let TID = req.body.traderID;
    let CID = req.body.companyID;
    let numOfShares = req.body.numOfShares;
    let findCompany  = `SELECT * FROM company WHERE companyid = $1`;
    client.query(findCompany, [CID], (err, company) => {
        if (err) {
            res.status(500, {error: err});
        }
        if (rows.length === 0) {
            res.status(400, {error: "INVALID COMPANYID"});
        }
        let priceID = company.rows[0].priceid;
        let findPrice = `SELECT * FROM price WHERE priceid = $1`;
        client.query(findPrice, [priceID], (err, price) => {
            if (err) {
                res.status(500, {error: err});
            }
            let row = price.rows[0];
            let value = row.value;
            let TXID = generateID();
            let addTX = `INSERT INTO transaction(transactionID, traderID, companyID, priceID, type, sharesPurchased) values($1, $2, $3, $4, $5, $6)`;
            client.query(addTX, [TXID, TID, CID, priceID, 1, numOfShares], (err) => {
                if (err) {
                    res.status(500, {error: err});
                }
                let findFunds = `SELECT funds FROM trader WHERE traderID = $1`;
                client.query(findFunds, [TID], (err, funds) => {
                    if (err) {
                        res.status(500, {error: err});
                    }
                    let amount = funds.rows[0];
                    amount -= (value*numOfShares);
                    let updateFunds = `UPDATE trader SET funds=($1) WHERE traderID=($2)`;
                    client.query(updateFunds, [amount, TID], (err) => {
                        if (err) {
                            res.status(500, {error: err});
                        }
                        let getPortID = `SELECT portfolioID FROM trader WHERE traderID = $1`;
                        client.query(getPortID, [TID], (err, portfolioIDrows) => {
                            if (err) {
                                res.status(500, {error: err});
                            }
                            let portfolioID = portfolioIDrows[0];
                            let check = `SELECT companyID FROM contains WHERE portfolioID = $1`;
                            client.query(check, [portfolioID], (err, companys) => {
                                if (err) {
                                    res.status(500, {error: err});
                                }
                                if (companys.rows.length === 0) {
                                    let addRow = `INSERT INTO contains(portfolioID, companyID) values($1, $2)`;
                                    client.query(addRow, [portfolioID, CID], (err) => {
                                        if (err) {
                                            res.status(500, {error: err});
                                        }
                                        res.status(200, {message: numOfShares + " of " + CID + " purchased"});
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

router.post('/sell', (req, res) => {
    let TID = req.body.traderID;
    let CID = req.body.companyID;
    let numOfShares = req.body.numOfShares;
    let findCompany  = `SELECT * FROM company WHERE companyid = $1`;
    client.query(findCompany, [CID], (err, company) => {
        if (err) {
            res.status(500, {error: err});
        }
        if (rows.length === 0) {
            res.status(400, {error: "INVALID COMPANYID"});
        }
        let priceID = company.rows[0].priceid;
        let findPrice = `SELECT * FROM price WHERE priceid = $1`;
        client.query(findPrice, [priceID], (err, price) => {
            if (err) {
                res.status(500, {error: err});
            }
            let row = price.rows[0];
            let value = row.value;
            let TXID = generateID();
            let addTX = `INSERT INTO transaction(transactionID, traderID, companyID, priceID, type, sharesPurchased) values($1, $2, $3, $4, $5, $6)`;
            client.query(addTX, [TXID, TID, CID, priceID, 0, numOfShares], (err) => {
                if (err) {
                    res.status(500, {error: err});
                }
                let findFunds = `SELECT funds FROM trader WHERE traderID = $1`;
                client.query(findFunds, [TID], (err, funds) => {
                    if (err) {
                        res.status(500, {error: err});
                    }
                    let amount = funds.rows[0];
                    amount += (value*numOfShares);
                    let updateFunds = `UPDATE trader SET funds=($1) WHERE traderID=($2)`;
                    client.query(updateFunds, [amount, TID], (err) => {
                        if (err) {
                            res.status(500, {error: err});
                        }
                        let getPortID = `SELECT portfolioID FROM trader WHERE traderID = $1`;
                        client.query(getPortID, [TID], (err, portfolioIDrows) => {
                            if (err) {
                                res.status(500, {error: err});
                            }
                            let portfolioID = portfolioIDrows[0];
                            let check = `SELECT companyID FROM contains WHERE portfolioID = $1`;
                            client.query(check, [portfolioID], (err, companys) => {
                                if (err) {
                                    res.status(500, {error: err});
                                }
                                if (companys.rows.length > 0) {
                                    let delteRow = `DELETE FROM contains WHERE portfolioID = $1 AND companyID = $2`;
                                    client.query(delteRow, [portfolioID, CID], (err) => {
                                        if (err) {
                                            res.status(500, {error: err});
                                        }
                                        res.status(200, {message: numOfShares + " of " + CID + " sold"});
                                    });
                                }
                            })
                        })
                    });
                });
            });
        });
    });
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

//Below are for testing


router.get("/getPrice/:id", (req, res) => {
    let id = req.params.id;
    let select = `SELECT * FROM price WHERE priceID = $1`;
    client.query(select, [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows[0]);
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
            res.send(result.rows[0]);
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