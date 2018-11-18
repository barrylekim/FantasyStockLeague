# Get all transactions

Return a list of all previous transactions with trader, company, price, and number of shares.

**URL** : `http://localhost:3005/transaction`

**Method** : `GET`

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/transaction`

## Success Response

**Condition** : If everything is OK and transaction list was returned.

**Code** : `200 OK`

**Content example**

```json
    [
        {
            "transactionid": "397565",
            "traderid": "453619",
            "companyid": "NFLX",
            "priceid": "254794",
            "type": "1",
            "sharespurchased": 10
        },
        {
            "transactionid": "42364",
            "traderid": "12431",
            "companyid": "MSFT",
            "priceid": "8234",
            "type": "1",
            "sharespurchased": 50
        },
        {
            "transactionid": "235643",
            "traderid": "3254",
            "companyid": "GOOG",
            "priceid": "93453",
            "type": "1",
            "sharespurchased": 150
        }
    ]
```

## Error Response

**Condition** : If transaction list could not be produced

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

