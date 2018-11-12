# Sell Stocks

Sell x number of shares of a given company for the specified trader.

**URL** : `http://localhost:3005/sell`

**Method** : `POST`

**Data constraints**

Provide name of company, ID of trader making the sale, and number of shares to be sold.

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
    "companyID": "GOOG",
    "traderID": "923",
    "numOfShares": "50"
}
```

## Success Response

**Condition** : If everything is OK and stock sale was successful.

**Code** : `200 OK`

**Content example**

```json
{
    "message": "x shares of <companyID> sold"
}
```

## Error Responses

**Condition** : If req body is missing information or invalid.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

### Or

**Condition** : If given companyID does not exist in database.

**Code** : `400 Bad Request Error`

**Content** : `{error: error message}`
