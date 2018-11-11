
const express = require("express");
var router = express.Router();
var pg = require("pg");
var connectionString = "postgres://304:rohan@localhost:5432/marketWatch";
var client = new pg.Client(connectionString);
client.connect();
let startingFund = 30000;
let IDMap = {};

let price = `CREATE TABLE IF NOT EXISTS price(priceID VARCHAR(10) NOT NULL PRIMARY KEY, pDate VARCHAR(100), value INTEGER)`;
let company = `CREATE TABLE IF NOT EXISTS company(companyID VARCHAR(4) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(32), companyName VARCHAR(32), priceID VARCHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;
let leaderBoard = `CREATE TABLE IF NOT EXISTS leaderboard(leaderboardID VARCHAR(10) NOT NULL PRIMARY KEY, numOfTraders INTEGER)`;
let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARCHAR(10) NOT NULL PRIMARY KEY, funds INTEGER, traderName VARCHAR(12) UNIQUE, leaderboardID VARCHAR(10) NOT NULL, portfolioID VARCHAR(10) NOT NULL, FOREIGN KEY (portfolioID) REFERENCES portfolio ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (leaderboardID) REFERENCES leaderboard ON DELETE CASCADE ON UPDATE CASCADE)`;
let portfolio = `CREATE TABLE IF NOT EXISTS portfolio(portfolioID VARCHAR(10) NOT NULL PRIMARY KEY)`;
let watchList = `CREATE TABLE IF NOT EXISTS watchlist(watchlistID VARCHAR(10) NOT NULL PRIMARY KEY, traderID VARCHAR(10), FOREIGN KEY (traderID) REFERENCES trader ON DELETE SET NULL ON UPDATE CASCADE)`;
let includes = `CREATE TABLE IF NOT EXISTS includes(watchlistID VARCHAR(10) NOT NULL, companyID CHAR(4) NOT NULL, PRIMARY KEY (companyID, watchlistID), FOREIGN KEY (watchlistID) REFERENCES watchlist(watchlistID) ON UPDATE CASCADE, FOREIGN KEY (companyID) REFERENCES company(companyID) ON UPDATE CASCADE)`;
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

// TODO
// Add a new leaderboard with 0 traders at first

let leaderboardID = 1;
let addLeaderboard = `INSERT INTO leaderboard(leaderboardID, numOfTraders) values ($1, $2)`
client.query(addLeaderboard, [leaderboardID, 0], (err, result) => {
    if (err) {
        console.log(err.detail);
    } else {
        console.log(result);
    }
});

router.get('/test', (req, res) => {
    let TXList = `SELECT * FROM transaction`;
    client.query(TXList).then((result) => {
        res.send(result.rows);
    }).catch((err) => {
        res.send(err);
    });
})

router.get('/portfolio', (req, res) => {
    let port = `SELECT * FROM portfolio`;
    client.query(port, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});

// given companyID and traderID
// get price from company(priceID)
// add transaction row
// update trader funds
// check contains table and update if necessary
router.post('/buy', (req, res) => {
    let TID = req.body.traderID;
    let CID = req.body.companyID;
    let numOfShares = req.body.numOfShares;
    let findCompany = `SELECT * FROM company WHERE companyid = $1`;
    client.query(findCompany, [CID]).then((company) => {
        if (company.rows.length === 0) {
            res.status(400).json({error: "INVALID COMPANYID"});
        } else {
            let priceID = company.rows[0].priceid;
            let findPrice = `SELECT * FROM price WHERE priceid = $1`;
            client.query(findPrice, [priceID]).then((price) => {
                let row = price.rows[0];
                let value = row.value;
                let TXID = generateID();
                let addTX = `INSERT INTO transaction(transactionID, traderID, companyID, priceID, type, sharesPurchased) values($1, $2, $3, $4, $5, $6)`;
                client.query(addTX, [TXID, TID, CID, priceID, 1, numOfShares]).then(() => {
                    let findFunds = `SELECT funds FROM trader WHERE traderID = $1`;
                    client.query(findFunds, [TID]).then((funds) => {
                        let amount = funds.rows[0].funds;
                        amount -= (value * numOfShares);
                        let updateFunds = `UPDATE trader SET funds=($1) WHERE traderID=($2)`;
                        client.query(updateFunds, [amount, TID]).then(() => {
                            let join = `SELECT companyID FROM trader NATURAL JOIN contains`;
                            client.query(join).then((companys) => {
                                if (companys.rows.length === 0) {
                                    let addRow = `INSERT INTO contains(portfolioID, companyID) values($1, $2)`;
                                    client.query(addRow, [portfolioID, CID]).then(() => {
                                        res.status(200).json({ message: numOfShares + " of " + CID + " purchased" });
                                    }).catch((err) =>{
                                        res.status(500).json({ error: err });
                                    });
                                } else {
                                    res.status(200).json({ message: numOfShares + " of " + CID + " purchased" });
                                }
                            });
                        });
                    });
                });
            });
        }
    }).catch((err) =>{
        res.status(500).json({ error: err });
    });
});

router.post('/sell', (req, res) => {
    let TID = req.body.traderID;
    let CID = req.body.companyID;
    let numOfShares = req.body.numOfShares;
    let findCompany = `SELECT * FROM company WHERE companyid = $1`;
    client.query(findCompany, [CID]).then((company) => {
        if (company.rows.length === 0) {
            res.status(400).json({error: "INVALID COMPANYID"});
        } else {
            let priceID = company.rows[0].priceid;
            let findPrice = `SELECT * FROM price WHERE priceid = $1`;
            client.query(findPrice, [priceID]).then((price) => {
                let row = price.rows[0];
                let value = row.value;
                let TXID = generateID();
                let addTX = `INSERT INTO transaction(transactionID, traderID, companyID, priceID, type, sharesPurchased) values($1, $2, $3, $4, $5, $6)`;
                client.query(addTX, [TXID, TID, CID, priceID, 0, numOfShares]).then(() => {
                    let findFunds = `SELECT funds FROM trader WHERE traderID = $1`;
                    client.query(findFunds, [TID]).then((funds) => {
                        let amount = funds.rows[0].funds;
                        amount += (value * numOfShares);
                        let updateFunds = `UPDATE trader SET funds=($1) WHERE traderID=($2)`;
                        client.query(updateFunds, [amount, TID]).then(() => {
                            let join = `SELECT companyID FROM trader NATURAL JOIN contains`;
                            client.query(join).then((companys) => {
                                if (companys.rows.length === 0) {
                                    let deleteRow = `DELETE FROM contains WHERE portfolioID = $1 AND companyID = $2`;
                                    client.query(deleteRow, [portfolioID, CID]).then(() => {
                                        res.status(200).json({ message: numOfShares + " of " + CID + " sold" });
                                    }).catch((err) =>{
                                        res.status(500).json({ error: err });
                                    });
                                } else {
                                    res.status(200).json({ message: numOfShares + " of " + CID + " sold" });
                                }
                            });
                        });
                    });
                });
            });
        }
    }).catch((err) =>{
        res.status(500).json({ error: err });
    });
});

generateID = function () {
    let id = Math.floor((Math.random() * 1000)).toString();
    while (IDMap[id]) {
        id = Math.floor((Math.random() * 1000)).toString();
    }
    return id;
}

//TODO
router.post('/addToWatchList', (req, res) => {
    let playerName = req.body.name;
    let companyCode = req.body.CID;
    let findWatchID = `SELECT traderID FROM trader WHERE tradername = $1`;
    client.query(findWatchID, [playerName], (err1, result1) => {
        if (err1) {
            res.status(500, {error: err1});
        } else {
            let findWatchListID = `SELECT watchlistID FROM watchlist WHERE traderID = $1`;
            client.query(findWatchListID, [result1.rows[0].traderid], (err1, result2) => {
                if (err1) {
                    res.status(500, {error: err1});
                } else {
                    let addToInclude = `INSERT INTO includes(watchlistID, companyID) values ($1, $2)`;
                    client.query(addToInclude, [result2.rows[0].watchlistid, companyCode], (err1, result2) => {
                        if (err1) {
                            res.status(500, {error: err1});
                        } else {
                            res.send("done");
                        }
                    });
                }
            });
        }
    });

});

//TODO
// add trader to leaderboard
// update numofplayers on leaderboard table
// create portfolio row and gave trader the same portfolio ID
// Tables changed: Trader, Portfolio, Leaderboard
router.post("/addTrader", (req, res) => {
    let name = req.body.name;
    let addPortfolioSQL = `INSERT INTO portfolio(portfolioID) values ($1)`
    let TID = generateID();
    let WLID = generateID();
    let PortID = generateID();
    client.query(addPortfolioSQL, [PortID], (err1, result1) => {
        if (err1) {
            res.status(500).json({ error: err1 });
        } else {
            let addTraderSQL = `INSERT INTO trader(traderID, funds, tradername, leaderboardID, portfolioID) values($1, $2, $3, $4, $5)`;
            client.query(addTraderSQL, [TID, startingFund, name, 1, PortID], (err2, result2) => {
                if (err2) {
                    res.status(500).json({ error: err2 });
                } else {
                    let leaderboardID = req.body.leaderboardID;
                    let updateLeaderboard = `UPDATE leaderboard SET numOfTraders = numOfTraders + 1 WHERE leaderboardID = $1`;
                    client.query(updateLeaderboard, [leaderboardID], (err3, result3) => {
                        if (err3) {
                            res.status(500).json({ error: err3 });
                        } else {
                            let addWatchList = `INSERT INTO watchlist(watchlistID, traderID) values ($1, $2)`;
                            client.query(addWatchList, [WLID, TID], (err1, result1) => {
                                if (err1) {
                                    res.status(500, {error: err1});
                                } else {
                                    res.send("Added trader + updated portfolio and leaderboard table + watchlist yeee");
                                }
                            });

                        }
                    });
                }
            });
        }
    });
});

// get trader info by id, useful to display portfolio on frontend
router.get("/getTrader/:id", (req, res) => {
    let getTrader = `SELECT * FROM trader WHERE traderID = $1`;
    client.query(getTrader, req.params.id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            let portfolioID = result.rows[0].portfolioID;
            let getPortfolio = `SELECT companyID FROM contains WHERE portfolioID = $1`;
            client.query(getPortfolio, [portfolioID], (err, companys) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).json({
                        trader: result.rows[0],
                        portfolio: companys.rows
                    });
                }
            });
        }
    })
});

//returns top 5 players on the leaderboard
router.get("/getTopPlayers", (req, res) => {

});

createPriceEntry = function (price) {
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

router.get("/getTraders", (req, res) => {
    let select = `SELECT * FROM trader`;
    client.query(select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

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
    });

    createPriceEntry(150).then((id1) => {
        client.query(addQuery, ["GOOG", 25, "Tech", "Google", id1], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    });

    createPriceEntry(200).then((id2) => {
        client.query(addQuery, ["VNET", 80, "Tech", "Vianet", id2], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    });
    createPriceEntry(250).then((id3) => {
        client.query(addQuery, ["AMD", 160, "Tech", "Amd", id3], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    });
    res.send();
});

module.exports = router;