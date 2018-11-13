# Buy Stocks

Purchase x number of shares of a given company for the specified trader.

**URL** : `http://localhost:3005/buy`

**Method** : `POST`

**Data constraints**

Provide name of company, ID of trader making the purchase, and number of shares to be purchased.

```json
{
    "companyID": "stock symbol",
    "traderID": "trader's ID",
    "numOfShares": "number of shares"
}
```

**Data example** All fields must be sent.

```json
{
    "companyID": "AAPL",
    "traderID": "717",
    "numOfShares": "20"
}
```

## Success Response

**Condition** : If everything is OK and stock purchase was successful.

**Code** : `200 OK`

**Content example**

```json
{
    "message": "x shares of <companyID> purchased"
}
```

## Error Response

**Condition** : User does not have enough funds.

**Code** : `400 Bad Request Error`

**Content** : `{error: "Trader does not have enough funds"}`

### Or

**Condition** : Given companyID does not exist in database.

**Code** : `400 Bad Request Error`

**Content** : `{error: Invalid CompanyID}`

### Or

**Condition** : If req body is missing information or invalid.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`
