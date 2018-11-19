var request = require('request');
var helper = require("./helpers");
var pg = require("pg");
var client = new pg.Client(process.env.CONNECTIONSTR);
client.connect();

module.exports = {
    createTables: function () {
        let price = `CREATE TABLE IF NOT EXISTS price(priceID VARCHAR(10) NOT NULL PRIMARY KEY, pDate VARCHAR(100), value REAL, changePercent REAL)`;
        let company = `CREATE TABLE IF NOT EXISTS company(companyID VARCHAR(6) NOT NULL PRIMARY KEY, numOfShares INTEGER, industry VARCHAR(100), companyName VARCHAR(200), priceID VARCHAR(10) NOT NULL, FOREIGN KEY (priceID) REFERENCES price(priceID))`;
        let leaderBoard = `CREATE TABLE IF NOT EXISTS leaderboard(leaderboardID VARCHAR(10) NOT NULL PRIMARY KEY, numOfTraders INTEGER)`;
        let trader = `CREATE TABLE IF NOT EXISTS trader(traderID VARCHAR(10) NOT NULL PRIMARY KEY, funds REAL, traderName VARCHAR(12) UNIQUE, leaderboardID VARCHAR(10) NOT NULL, portfolioID VARCHAR(10) NOT NULL, FOREIGN KEY (portfolioID) REFERENCES portfolio ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (leaderboardID) REFERENCES leaderboard ON DELETE CASCADE ON UPDATE CASCADE)`;
        let portfolio = `CREATE TABLE IF NOT EXISTS portfolio(portfolioID VARCHAR(10) NOT NULL PRIMARY KEY)`;
        let watchList = `CREATE TABLE IF NOT EXISTS watchlist(watchlistID VARCHAR(10) NOT NULL PRIMARY KEY, traderID VARCHAR(10), FOREIGN KEY (traderID) REFERENCES trader ON DELETE SET NULL ON UPDATE CASCADE)`;
        let includes = `CREATE TABLE IF NOT EXISTS includes(watchlistID VARCHAR(10) NOT NULL, companyID VARCHAR(6) NOT NULL, PRIMARY KEY (companyID, watchlistID), FOREIGN KEY (watchlistID) REFERENCES watchlist(watchlistID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
        let contains = `CREATE TABLE IF NOT EXISTS contains(portfolioID VARCHAR(10) NOT NULL, companyID VARCHAR(6), shares INTEGER DEFAULT 0, PRIMARY KEY (portfolioID, companyID), FOREIGN KEY (portfolioID) REFERENCES portfolio(portfolioID), FOREIGN KEY (companyID) REFERENCES company(companyID))`;
        let transaction = `CREATE TABLE IF NOT EXISTS transaction(transactionID VARCHAR(10) PRIMARY KEY, traderID VARCHAR(10) NOT NULL, companyID VARCHAR(6) NOT NULL, priceID VARCHAR(10) NOT NULL, type BIT(1), sharesPurchased INTEGER, FOREIGN KEY (traderID) REFERENCES trader(traderID) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (priceID) REFERENCES price(priceID) ON DELETE NO ACTION ON UPDATE CASCADE)`;

        let arr = [price, company, leaderBoard, portfolio, trader, watchList, includes, contains, transaction];

        arr.forEach((query) => {
            client.query(query, (err, result) => {
                if (err) {
                    console.log(query + err);
                }
            })
        });
    },

    createLeaderboard: function () {
        let leaderboardID = 1;
        let addLeaderboard = `INSERT INTO leaderboard(leaderboardID, numOfTraders) values ($1, $2)`
        client.query(addLeaderboard, [leaderboardID, 0], (err, result) => {
            if (err) {
                console.log(err.detail);
            }
        });
    },

    getCompanyByID: async function (CID) {
        try {
            let findCompany = `SELECT * FROM company WHERE companyid = $1`;
            let company = await client.query(findCompany, [CID]);
            return company;
        } catch (err) {
            throw err;
        }
    },

    addTransaction: async function (TID, CID, priceID, type, numOfShares) {
        try {
            let TXID = generateID();
            let addTX = `INSERT INTO transaction(transactionID, traderID, companyID, priceID, type, sharesPurchased) values($1, $2, $3, $4, $5, $6)`;
            await client.query(addTX, [TXID, TID, CID, priceID, type, numOfShares]);
            return;
        } catch (err) {
            throw err;
        }
    },

    getValue: async function (priceID) {
        try {
            let findPrice = `SELECT * FROM price WHERE priceid = $1`;
            let price = await client.query(findPrice, [priceID]);
            return price.rows[0].value;
        } catch (err) {
            throw err;
        }
    },

    updateFunds: async function (TID, value, numOfShares, type) {
        try {
            let findFunds = `SELECT funds FROM trader WHERE traderID = $1`;
            let funds = await client.query(findFunds, [TID]);
            let amount = funds.rows[0].funds;
            if (type === 1) {
                amount -= (value * numOfShares);
            } else {
                amount += (value * numOfShares);
            }
            let updateFunds = `UPDATE trader SET funds=($1) WHERE traderID=($2)`;
            await client.query(updateFunds, [amount, TID]);
            return;
        } catch (err) {
            throw err;
        }
    },

    getPortfolioID: async function (TID) {
        try {
            let getPortID = `SELECT portfolioID FROM trader WHERE traderID = $1`;
            let rows = await client.query(getPortID, [TID]);
            let portfolioID = rows.rows[0].portfolioid;
            return portfolioID;
        } catch (err) {
            throw err;
        }
    },

    checkContains: async function (portfolioID, CID, type, numOfShares) {
        try {
            let join = `SELECT * FROM contains WHERE portfolioID = $1 AND companyID = $2`;
            let companys = await client.query(join, [portfolioID, CID]);
            if (type === 1) {
                if (companys.rows.length === 0) {
                    let addRow = `INSERT INTO contains(portfolioID, companyID, shares) values($1, $2, $3)`;
                    await client.query(addRow, [portfolioID, CID, numOfShares]);
                } else {
                    let get = `SELECT shares FROM contains WHERE portfolioID = $1 AND companyID = $2`;
                    let response = await client.query(get, [portfolioID, CID]);
                    let shares = response.rows[0].shares;
                    shares += parseInt(numOfShares);
                    let update = `UPDATE contains SET shares=($1) WHERE portfolioID = $2 AND companyID = $3`;
                    await client.query(update, [shares, portfolioID, CID]);
                }
            } else {
                if (companys.rows.length === 1) {
                    let get = `SELECT shares FROM contains WHERE portfolioID = $1 AND companyID = $2`;
                    let response = await client.query(get, [portfolioID, CID]);
                    let shares = response.rows[0].shares;
                    shares -= parseInt(numOfShares);
                    if (shares < 1) {
                        let deleteRow = `DELETE FROM contains WHERE portfolioID = $1 AND companyID = $2`;
                        await client.query(deleteRow, [portfolioID, CID]);
                    } else {
                        let update = `UPDATE contains SET shares=($1) WHERE portfolioID = $2 AND companyID = $3`;
                        await client.query(update, [shares, portfolioID, CID]);
                    }
                }
            }
            return;
        } catch (err) {
            throw err;
        }
    },

    createPriceEntry: function (price, changePercent) {
        return new Promise((resolve, reject) => {
            let id = generateID();
            let date = new Date();
            let addPrice = `INSERT INTO price(priceID, pDate, value, changePercent) values($1, $2, $3, $4)`;
            client.query(addPrice, [id, date.toString(), price, changePercent], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(id);
                }
            });
        })
    },

    getAPI: function (url) {
        return new Promise(function (resolve, reject) {
            request({
                url: url,
                method: 'GET'
            }, function (err, response, body) {
                if (err) {
                    console.log("ERROR: " + err);
                } else {
                    resolve(body);
                }
            });
        })
    },

    getPriceIds: function (priceid, amountofshares) {
        return new Promise(function (resolve, reject) {
            let findVal = `SELECT value, priceID FROM price WHERE priceID = $1`;
            let eachValue = [];
            priceid.forEach(async (x) => {
                await eachValue.push(client.query(findVal, [x]));
            });
            Promise.all(eachValue).then((val) => {
                let result = [];
                val.forEach((x) => {
                    result.push(x.rows[0].value);
                });
                let worth = result.reduce(function (r, a, i) {
                    return r + a * amountofshares[i]
                }, 0);
                return resolve(worth);
            });
        });
    },

    checkTraderFunds: async function (TID, price) {
        try {
            let find = `SELECT funds FROM trader WHERE traderid = $1`;
            let response = await client.query(find, [TID])
            let funds = response.rows[0].funds;
            if (funds - price >= 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },

    addCompany: async function (symbol, json, industry) {
        let name = json.companyName;
        let price = json.latestPrice;
        let volume = json.latestVolume;
        let changePercent = json.changePercent;
        if (typeof price === "number" && typeof name === "string" && typeof volume === "number" && typeof changePercent === "number") {
            let id = await this.createPriceEntry(price, changePercent);
            let find = `SELECT * from company WHERE companyid = $1`;
            let check = await client.query(find, [symbol]);
            if (check.rows.length === 0) {
                if (typeof symbol === "string" && typeof industry === "string" && industry.length > 0 && typeof name === "string" && name.length > 0 && typeof volume === "number") {
                    let addQuery = `INSERT INTO company(companyID, numOfShares, industry, companyName, priceID) values($1, $2, $3, $4, $5)`;
                    await client.query(addQuery, [symbol, volume, industry, name, id]);
                }
            } else {
                if (typeof symbol === "string" && typeof volume === "number") {
                    let updateCompany = `UPDATE company SET priceid=($1), numOfShares=($2) WHERE companyid=($3)`;
                    await client.query(updateCompany, [id, volume, symbol]);
                }
            }
        }
    },

    getNetWorth: async function (inputname) {
        let name = inputname;
        let getPortfolioID = `SELECT portfolioID, funds FROM trader WHERE tradername = $1`;
        let result1 = await client.query(getPortfolioID, [name]);
        let portfolioID = result1.rows[0].portfolioid;
        let funds = result1.rows[0].funds;
        let companyAndPriceView = `CREATE OR REPLACE VIEW temp(companyID, value) AS SELECT c.companyID, p.value FROM company c, price p WHERE c.priceID = p.priceID`;
        await client.query(companyAndPriceView);
        // Gives us companyID, the number of shares this person owns and the price of each share
        let selectFromView = `SELECT t.companyID, c.shares, t.value FROM temp t, contains c WHERE t.companyID = c.companyID AND portfolioID = $1`;
        let result3 = await client.query(selectFromView, [portfolioID]);
        // Loop through each row to calculate the total value of each company and add it together for that person
        // console.log("ATTENTION" + result3.rows);
        let arrayOfValues = [];
        let companiesWorth = 0;
        for (let company of result3.rows) {
            arrayOfValues.push(company.shares * company.value);
        }
        for (let i of arrayOfValues) {
            companiesWorth = companiesWorth + i;
        }
        let totalWorth = companiesWorth + funds;
        return totalWorth;
    }
}