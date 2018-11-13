const express = require("express");
var router = express.Router();
var helper = require("./helpers");
var pg = require("pg");
var client = new pg.Client(process.env.CONNECTIONSTR);
client.connect();
let startingFund = 30000;
let IDMap = {};

helper.start();

router.get("/init", async (req, res) => {
    let arr = ["AAPL", "GOOG", "AMZN", "MSFT", "NFLX", "GS", "SBUX", "NKE"];
    let names = ["Apple", "Google", "Amazon", "Microsoft", "Goldman Sachs", "Netflix", "Starbucks", "Nike"];
    let industries = ["techonology", "technology", "technology", "technology", "entertainment", "Finance", "Coffee shop", "Sports"];
    let promises = [];
    for (let i = 0; i < arr.length; i++) {
        let find = `SELECT * from company WHERE companyid = $1`
        client.query(find, [arr[i]], (err, res) => {
            if (res.rows.length === 0) {
                let promise = helper.getAPI(arr[i]).then((result) => {
                    let json = JSON.parse(result)[0];
                    let price = parseInt(json.average);
                    let volume = parseInt(json.volume);
                    helper.createPriceEntry(price).then((id) => {
                        let addQuery = `INSERT INTO company(companyID, numOfShares, industry, companyName, priceID) values($1, $2, $3, $4, $5)`;
                        client.query(addQuery, [arr[i], volume, industries[i], names[i], id], (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                });
                promises.push(promise);
            }
        });
    }
    Promise.all(promises).then(() => {
        res.send("added");
    });
});

// get tradernames of all the traders who have purchased all the companys in the database
router.get("/traderAll", (req, res) => {
    let all = `SELECT t.tradername FROM trader AS t WHERE NOT EXISTS ((SELECT c.companyID FROM company AS c) EXCEPT (SELECT companyID FROM trader as t, contains as c WHERE t.portfolioid = c.portfolioID))`;
    let tryAgain = `SELECT t.tradername FROM trader AS t WHERE NOT EXISTS ((SELECT c.companyID from company AS c) EXCEPT (SELECT companyID FROM contains))`;

    client.query(tryAgain, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response.rows);
            res.send(response.rows);
        }
    })
});

router.get("/largestShare", (req, res) => {
    let select = `SELECT traderID, companyID, MAX(total) AS max FROM (SELECT traderID, companyID, SUM (sharesPurchased) AS total FROM transaction GROUP BY traderID, companyID) AS innerTable GROUP BY traderID, companyID HAVING total = MAX(total) ORDER BY max DESC`;
    //let select = `SELECT companyID, MAX(value), tradername FROM transaction NATURAL JOIN price WHERE value = MAX(value) GROUP BY companyID`;
    let try1 = `SELECT traderID, companyID, SUM(sharesPurchased) AS total FROM transaction GROUP BY companyID, traderID ORDER BY total DESC`;
    client.query(try1, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            let maxTrader = result.rows[0].traderid;
            res.status(200).json({traderID: maxTrader});
        }
    });
});

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
            if (helper.checkTraderFunds(TID, price)) {
                await helper.addTransaction(TID, CID, priceID, 1, numOfShares);
                await helper.updateFunds(TID, price, numOfShares, 1);
                let portfolioID = await helper.getPortfolioID(TID);
                await helper.checkContains(portfolioID, CID, 1, numOfShares);
                res.status(200).json({ message: numOfShares + " of " + CID + " purchased" });
            } else {
                res.status(400).json({ error: "Trader does not have enough funds"});
            }
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
            await helper.checkContains(portfolioID, CID, 0, numOfShares);
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
                    let leaderboardID = 1;
                    let findNumOfTraders = `SELECT numOfTraders FROM leaderBoard where leaderboardID = $1`;
                    client.query(findNumOfTraders, [1], (err3, result) => {
                        if (err3) {
                            res.status(500).json({ error: err3 });
                        } else {
                            let actualNumOfTraders = result.rows[0].numoftraders;
                            actualNumOfTraders = actualNumOfTraders + 1;
                            let updateLeaderboard = `UPDATE leaderboard SET numOfTraders = ($1) WHERE leaderboardID = $2`;
                            client.query(updateLeaderboard, [actualNumOfTraders, leaderboardID], (err4, result3) => {
                                if (err3) {
                                    res.status(500).json({ error: err4 });
                                } else {
                                    let addWatchList = `INSERT INTO watchlist(watchlistID, traderID) values ($1, $2)`;
                                    client.query(addWatchList, [WLID, TID], (err1, result1) => {
                                        if (err1) {
                                            res.status(500).json({ error: err1 });
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

// get the user with most transactions
// Go to the transaction table
router.get("/getMostTransPlayer", (req, res) => {
    let getNumOfTransForEachTrader = `SELECT traderID, COUNT(transactionID) FROM transaction GROUP BY traderID ORDER BY COUNT(transactionID) DESC`;
    client.query(getNumOfTransForEachTrader, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            let highestTransTraderID = result.rows[0].traderid;
            res.status(200).json({ message: "TraderID of player with most transactions:" + highestTransTraderID })
        }
    })
});

//returns top 5 players on the leaderboard, does not work because it looks at funds
router.get("/getTopPlayers", (req, res) => {
    let getALLTradersSortedTopDownSQL = `SELECT traderID, tradername, funds FROM trader ORDER BY funds DESC`;
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

// Returns an array of all player names, you can maybe call this one and pass it to netbuy and netsell to get the top 5 players
router.get("/getAllPlayers", (req, res) => {
    let getAllTraders = `SELECT tradername FROM trader`;
    let traderArr = [];
    client.query(getAllTraders, (err, result) => {
        if (err) {
            console.log("getall" + err);
        } else {
            result.rows.forEach((x) => {
                traderArr.push(x.tradername);
            });
            res.send(traderArr);
        }
    });
});

// To get networth call netBuy and then subtract netSell, netBuy is the value of (all buy transactions + funds), netSell is the value of (all sell transactions)
router.get("/netSell", async (req, res) => {
    let name = req.body.name;
    let sellTransactions = [];
    let amountofsharesSell = [];
    let priceidsSell = [];
    let findTraderId = `SELECT traderID FROM trader WHERE tradername = $1`;
    client.query(findTraderId, [name], (err, result1) => {
        if (err) {
            console.log(findTraderId + err);
        } else {
            let findTransactions = `SELECT transactionID, type, sharesPurchased FROM transaction WHERE traderID = $1`;
            client.query(findTransactions, [result1.rows[0].traderid], (err, result2) => {
                if (err) {
                    console.log("find sellTransactions" + err);
                } else {
                    for (let key in result2.rows) {
                        if (result2.rows[key].type === '0') {
                            sellTransactions.push(result2.rows[key].transactionid);
                        }
                    }
                    let findPriceId = `SELECT priceID, sharesPurchased FROM transaction WHERE transactionID = ANY($1)`;
                    client.query(findPriceId, [sellTransactions], (err, result3) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            for (let key in result3.rows) {
                                priceidsSell.push(result3.rows[key].priceid);
                                amountofsharesSell.push(result3.rows[key].sharespurchased);
                            }
                            let worth = helper.getPriceIds(priceidsSell, amountofsharesSell);
                            Promise.all([worth]).then((x) => {
                                let stockWorth = JSON.stringify(x);
                                let stockWorth1 = stockWorth.replace("[", "");
                                let stockWorth2 = stockWorth1.replace("]", "");
                                let findFunds = `SELECT funds FROM trader WHERE tradername = $1`;
                                client.query(findFunds, [name], (err, result4) => {
                                    if (err) {
                                        res.status(500).json({ error: err });
                                    } else {
                                        let worth = Number(stockWorth2);
                                        res.send(worth.toString());
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/deleteTrader/:id", (req, res) => {
    let find = `SELECT * FROM trader WHERE traderid = $1`;
    client.query(find, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.rows.length === 0) {
            res.status(400).json({error: "id does not exist"});
        } else {
            let deleteRow = `DELETE FROM trader WHERE traderID = $1`;
            client.query(deleteRow, [req.params.id], (err, response) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({message: "trader deleted"});
                }
            })
        }
    });
});

router.get("/netBuy", async (req, res) => {
    let name = req.body.name;
    let buyTransactions = [];
    let amountofsharesBuy = [];
    let priceidsBuy = [];
    let findTraderId = `SELECT traderID FROM trader WHERE tradername = $1`;
    client.query(findTraderId, [name], (err, result1) => {
        if (err) {
            console.log(findTraderId + err);
        } else {
            let findTransactions = `SELECT transactionID, type, sharesPurchased FROM transaction WHERE traderID = $1`;
            client.query(findTransactions, [result1.rows[0].traderid], (err, result2) => {
                if (err) {
                    console.log("find buyTransactions" + err);
                } else {
                    for (let key in result2.rows) {
                        if (result2.rows[key].type === '1') {
                            buyTransactions.push(result2.rows[key].transactionid);
                        }
                    }
                    let findPriceId = `SELECT priceID, sharesPurchased FROM transaction WHERE transactionID = ANY($1)`;
                    client.query(findPriceId, [buyTransactions], (err, result3) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            for (let key in result3.rows) {
                                priceidsBuy.push(result3.rows[key].priceid);
                                amountofsharesBuy.push(result3.rows[key].sharespurchased);
                            }
                            let worth = helper.getPriceIds(priceidsBuy, amountofsharesBuy);
                            Promise.all([worth]).then((x) => {
                                let stockWorth = JSON.stringify(x);
                                let stockWorth1 = stockWorth.replace("[", "");
                                let stockWorth2 = stockWorth1.replace("]", "");
                                let findFunds = `SELECT funds FROM trader WHERE tradername = $1`;
                                client.query(findFunds, [name], (err, result4) => {
                                    if (err) {
                                        res.status(500).json({ error: err });
                                    } else {
                                        let fundsNum = result4.rows[0].funds.toString();
                                        let fundsNum2 = fundsNum.replace("$", "");
                                        let fundsNum3 = fundsNum2.replace(",", "");
                                        let fundsNum4 = fundsNum3.replace(".", "");
                                        let worth = Number(stockWorth2) + (Number(fundsNum4) / 100);
                                        res.send(worth.toString());
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/getTrader/:name", async (req, res) => {
    try {
        let getTrader = `SELECT * FROM trader WHERE tradername = $1`;
        let result = await client.query(getTrader, [req.params.name]);
        if (result.rows.length === 0) {
            res.status(404).json({error: "Trader name not found"});
        } else {
            let portfolioID = result.rows[0].portfolioid;
            let getPortfolio = `SELECT companyid, numofshares, industry, companyname, value, shares FROM contains NATURAL JOIN company NATURAL JOIN price WHERE portfolioID = $1`;
            let companys = await client.query(getPortfolio, [portfolioID]);
            let getwatchList = `SELECT companyID FROM trader NATURAL JOIN includes WHERE tradername = $1`;
            let response = await client.query(getwatchList, [req.params.name]);
            res.status(200).json({
                trader: result.rows[0],
                portfolio: companys.rows,
                watchlist: response.rows
            });
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

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

    helper.createPriceEntry(58).then((id) => {
        client.query(addQuery, ["AAPL", 50, "Tech", "Apple", id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    });

    helper.createPriceEntry(150).then((id1) => {
        client.query(addQuery, ["GOOG", 25, "Tech", "Google", id1], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    });

    helper.createPriceEntry(200).then((id2) => {
        client.query(addQuery, ["VNET", 80, "Tech", "Vianet", id2], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    });

    helper.createPriceEntry(250).then((id3) => {
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