# Get Trader

Return trader info, including their portfolio and watchlist given the name of a trader.

**URL** : `http://localhost:3005/getTrader/:name`

**Method** : `GET`

**Data constraints**

Provide name of the trader in the url.

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/getTrader/Barry`

## Success Response

**Condition** : If everything is OK and trader with name was found.

**Code** : `200 OK`

**Content example**

```json
{
    "trader": {
        "traderid": "957",
        "funds": 15710,
        "tradername": "Barry",
        "leaderboardid": "1",
        "portfolioid": "105"
    },
    "portfolio": [
        {
            "companyid": "SBUX",
            "numofshares": 0,
            "industry": "Coffee shop",
            "companyname": "Starbucks",
            "value": -1,
            "shares": 70
        },
        {
            "companyid": "AAPL",
            "numofshares": 3145,
            "industry": "technology",
            "companyname": "Apple",
            "value": 218,
            "shares": 210
        }
    ],
    "watchlist": [
        {
            "companyid": "NFLX"
        },
        {
            "companyid": "MSFT"
        }
    ]
}
```

## Error Response

**Condition** : Given trader name does not exist in database.

**Code** : `404 Not Found Error`

**Content** : `{error: Trader name not found}`

### Or

**Condition** : If req body is missing information or invalid.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

