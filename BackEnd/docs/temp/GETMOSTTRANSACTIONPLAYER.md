# Trader that made the most transaction

Return the traderID and tradername that made the most transaction.

**URL** : `http://localhost:3005/getMostTransactionPlayer`

**Method** : `GET`

**Data constraints**

None.

## Success Response

**Condition** : If everything is OK and trader list returned.

**Code** : `200 OK`

**Content example**

```json
{
    "traderid": "335016",
    "tradername": "Barry"
}
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

