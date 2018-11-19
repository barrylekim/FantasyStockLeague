const helper = require("./helpers");

getStock = function (symbol) {
    return new Promise((res, rej) => {
        try {
            helper.getAPI("https://api.iextrading.com/1.0/stock/" + symbol + "/batch?types=quote&range=1m&last=1").then((data) => {
                res(data);
            });
        } catch (err) {
            console.log(err);
        }
    });
}

addAPICompanies = function() {
    return new Promise(async (resolve, reject) => {
        let result = await helper.getAPI("https://ws-api.iextrading.com/1.0/ref-data/symbols");
        let promises = [];
        let json = JSON.parse(result);
        for (var i = 0; i < json.length; i+=15) {
            let symbol = json[i].symbol;
            let promise = helper.getAPI("https://api.iextrading.com/1.0/stock/" + symbol + "/company").then(async (data) => {
                try {
                    let industry = JSON.parse(data).industry;
                    return getStock(symbol).then(async (response) => {
                        try {
                            let json = JSON.parse(response).quote;
                            await helper.addCompany(symbol, json, industry);
                        } catch (err) {
                            //console.log(err);
                        }
                    });
                } catch (err) {
                    //console.log(err);
                } 
            });
            promises.push(promise); 
        }
        Promise.all(promises).then(() => {
            console.log("project ready");
            resolve();
        }); 
    });
}

addBigCompanies = function() {
    return new Promise(async (resolve, reject) => {
        let arr = ["GOOG", "AAPL", "NFLX", "SPOT", "AMD", "MSFT", "GS", "ADBE", "SNE", "AMZN"];
        let promises = [];
        for (var i = 0; i < arr.length; i++) {
            let symbol = arr[i];
            try {
                let promise = helper.getAPI("https://api.iextrading.com/1.0/stock/" + symbol + "/company").then(async (data) => {
                    try {
                        let industry = JSON.parse(data).industry;
                        return getStock(symbol).then(async (response) => {
                            try {
                                let json = JSON.parse(response).quote;
                                await helper.addCompany(symbol, json, industry);
                            } catch (err) {
                                console.log(err);
                            }
                        })
                    } catch (err) {
                        console.log(err);
                    } 
                });
                promises.push(promise);  
            } catch (err) {
                console.log(err);
            }
        }
        Promise.all(promises).then(() => {
            console.log("big name companies added");
            resolve();
        });
    })
}

module.exports = {
    start: async function() {
        await helper.createTables();
        await helper.createLeaderboard();
        await addBigCompanies();
        await addAPICompanies();
        return;
    },

    update: async function() {
        await addBigCompanies();
        await addAPICompanies();
        return;
    }
}