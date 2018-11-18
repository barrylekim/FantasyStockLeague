# Traders Above

Return a list of all traders above a given fund amount.

**URL** : `http://localhost:3005/tradersAbove/:funds`

**Method** : `GET`

**Data constraints**

Provide fund boundary in the url.

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/tradersAbove/2000`

## Success Response

**Condition** : If everything is OK and trader list returned.

**Code** : `200 OK`

**Content example**

```json
[
    {
        "tradername": "rohan"
    },
    {
        "tradername": "barry"
    },
    {
        "tradername": "diego"
    },
    {
        "tradername": "jason"
    }
]
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

