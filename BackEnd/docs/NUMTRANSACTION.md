# Number of Transactions

Number of transactions for each company.

**URL** : `http://localhost:3005/numTransactions`

**Method** : `GET`

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/numTransactions`

## Success Response

**Condition** : If everything is OK and trader list returned.

**Code** : `200 OK`

**Content example**

```json
[
    {
        "companyid": "NFLX",
        "count": "1240"
    },
    {
        "companyid": "AMD",
        "count": "60"
    }
    {
        "companyid": "GS",
        "count": "740"
    }
]
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

