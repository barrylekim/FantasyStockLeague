const express = require("express");
var router = express.Router();
var helper = require("./helpers");
var pg = require("pg");
var client = new pg.Client(process.env.CONNECTIONSTR);
client.connect();
let startingFund = 30000;
let IDMap = {};

helper.start();

router.get("/init", (req, res) => {
    let arr = ["AAPL", "GOOG", "AMZN", "MSFT", "NFLX", "TWTR", "FB", "DOW J", "SBUX", "NKE"];
    let names = ["Apple", "Google", "Amazon", "Microsoft", "Netflix", "Twitter", "Facebook", "Dow Jones", "Starbucks", "Nike"];
    let industries = ["techonology", "techbology", "technology", "technology", "entertainment", "Social Media", "Social Media", "Finance", "Coffee shop", "Sports"];
    for (var i = 0; i < arr.length; i++) {
        helper.getAPI().then((result) => {
            let price = JSON.parse(result)["Time Series (Daily)"]["2018-11-09"]["1. open"];
            let volume = JSON.parse(result)["Time Series (Daily)"]["2018-11-09"]["5. volume"];
            createPriceEntry(price).then((id) => {
                let addQuery = `INSERT INTO company(companyID, numOfShares, industry, companyName, priceID) values($1, $2, $3, $4, $5)`;
                client.query(addQuery, [arr[i], volume, industries[i], names[i], id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                });
            });
        });
    }
})

router.post("/buy", async (req, res) => {
    try {
        let TID = req.body.traderID;
        let CID = req.body.companyID;
        let numOfShares = req.body.numOfShares;
        let company = await helper.getCompanyByID(CID);
        if (company.rows.length === 0) {
            res.status(400).json({ error: "Invalid CompanyID" });
        } else {
            let priceID = company.rows[0].priceid;
            let price = await helper.getValue(priceID);
            await helper.addTransaction(TID, CID, priceID, 1, numOfShares);
            await helper.updateFunds(TID, price, numOfShares, 1);
            let portfolioID = await helper.getPortfolioID(TID);
            await helper.checkContains(portfolioID, CID, 1);
            res.status(200).json({ message: numOfShares + " of " + CID + " purchased" });
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post("/sell", async (req, res) => {
    try {
        let TID = req.body.traderID;
        let CID = req.body.companyID;
        let numOfShares = req.body.numOfShares;
        let company = await helper.getCompanyByID(CID);
        if (company.rows.length === 0) {
            res.status(400).json({ error: "Invalid CompanyID" });
        } else {
            let priceID = company.rows[0].priceid;
            let price = await helper.getValue(priceID);
            await helper.addTransaction(TID, CID, priceID, 0, numOfShares);
            await helper.updateFunds(TID, price, numOfShares, 0);
            let portfolioID = await helper.getPortfolioID(TID);
            await helper.checkContains(portfolioID, CID, 0);
            res.status(200).json({ message: numOfShares + " of " + CID + " sold" });
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

generateID = function () {
    let id = Math.floor((Math.random() * 1000)).toString();
    while (IDMap[id]) {
        id = Math.floor((Math.random() * 1000)).toString();
    }
    return id;
}

router.post('/addToWatchList', (req, res) => {
    let playerName = req.body.name;
    let companyCode = req.body.CID;
    let findWatchID = `SELECT traderID FROM trader WHERE tradername = $1`;
    client.query(findWatchID, [playerName], (err1, result1) => {
        if (err1) {
            res.status(500).json({ error: err1 });
        } else {
            let findWatchListID = `SELECT watchlistID FROM watchlist WHERE traderID = $1`;
            client.query(findWatchListID, [result1.rows[0].traderid], (err1, result2) => {
                if (err1) {
                    res.status(500).json({ error: err1 });
                } else {
                    let addToInclude = `INSERT INTO includes(watchlistID, companyID) values ($1, $2)`;
                    client.query(addToInclude, [result2.rows[0].watchlistid, companyCode], (err1, result2) => {
                        if (err1) {
                            res.status(500).json({ error: err1 });
                        } else {
                            res.status(200).json({ message: "done" });
                        }
                    });
                }
            });
        }
    });

});
// findTrader pass the name and you will get the id
router.get("/findTrader", (req, res) => {
    let name = req.body.name;
    let findname = `SELECT traderID FROM trader WHERE tradername = $1`
    client.query(findname, [name], (err1, result1) => {
        if (err1) {
            res.status(500).json({ error: err1 });
        } else {
            res.send(result1.rows[0].traderid);
        }
    });
});

// add trader to leaderboard
// update numofplayers on leaderboard table
// create portfolio row and gave trader the same portfolio ID
// Tables changed: Trader, Portfolio, Leaderboard
router.post("/addTrader", (req, res) => {
    let name = req.body.name;
    let addPortfolioSQL = `INSERT INTO portfolio(portfolioID) values ($1)`
    let TID = generateID();
    let PortID = generateID();
    client.query(addPortfolioSQL, [PortID], (err1, result1) => {
        if (err1) {
            res.status(500, { error: err1 });
        } else {
            let addTraderSQL = `INSERT INTO trader(traderID, funds, tradername, leaderboardID, portfolioID) values($1, $2, $3, $4, $5)`;
            client.query(addTraderSQL, [TID, startingFund, name, 1, PortID], (err2, result2) => {
                if (err2) {
                    res.status(500, { error: err2 });
                } else {
                    let leaderboardID = 1;
                    let findNumOfTraders = `SELECT numOfTraders FROM leaderBoard where leaderboardID = $1`;
                    client.query(findNumOfTraders, [1], (err3, result) => {
                        if (err3) {
                            res.status(500, { error: err3 });
                        } else {
                            let actualNumOfTraders = result.rows[0].numoftraders;
                            actualNumOfTraders = actualNumOfTraders + 1;
                            let updateLeaderboard = `UPDATE leaderboard SET numOfTraders = ($1) WHERE leaderboardID = $2`;
                            client.query(updateLeaderboard, [actualNumOfTraders, leaderboardID], (err4, result3) => {
                                if (err3) {
                                    res.status(500, { error: err4 });
                                } else {
                                    let addWatchList = `INSERT INTO watchlist(watchlistID, traderID) values ($1, $2)`;
                                    client.query(addWatchList, [WLID, TID], (err1, result1) => {
                                        if (err1) {
                                            res.status(500).json({error: err1});
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
        }
    });
});

//returns top 5 players on the leaderboard
router.get("/getTopPlayers", (req, res) => {
    let getALLTradersSortedTopDownSQL = `SELECT traderID, tradername funds FROM trader ORDER BY funds DESC`;
    client.query(getALLTradersSortedTopDownSQL, (err, result) => {
        if (err) {
            console.log(getALLTradersSortedTopDownSQL + err);
        } else {
            // console.log(result);
            let arr = [];
            var index = 0;
            var length = result.rows.length;
            while (index < 10 && length > 0) {
                arr.push(result.rows[index]);
                index++;
                length--;
            }
            res.send(arr);
        }
    });
});

// get trader info by id, useful to display portfolio on frontend
router.get("/getTrader/:id", (req, res) => {
    let getTrader = `SELECT * FROM trader WHERE traderID = $1`;
    client.query(getTrader, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            let portfolioID = result.rows[0].portfolioid;
            let getPortfolio = `SELECT companyid, numofshares, industry, companyname, value FROM contains NATURAL JOIN company NATURAL JOIN price WHERE portfolioID = $1`;
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
        client.query(addQuery, ["AAPL", 50, "Tech", "Apple", id], (err, result) => {
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