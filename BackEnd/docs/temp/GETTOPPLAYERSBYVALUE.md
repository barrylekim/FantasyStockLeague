# Get Top Traders

Return the top 10 players, based on their net worth - the number of of shares they bought from companies and the current price of those shares.

**URL** : `http://localhost:3005/getTopPlayersByValue`

**Method** : `GET`

**Data constraints**

None.

## Success Response

**Condition** : If everything is OK and trader with name was found.

**Code** : `200 OK`

**Content example**

```json
[
    {
        "traderid": "590870",
        "tradername": "Diego",
        "networth": 30000
    },
    {
        "traderid": "816300",
        "tradername": "Michael",
        "networth": 30000
    },
    {
        "traderid": "424639",
        "tradername": "Bob",
        "networth": 30000
    },
    {
        "traderid": "40058",
        "tradername": "Freddie",
        "networth": 30000
    },
    {
        "traderid": "547073",
        "tradername": "Jason",
        "networth": 30000
    },
    {
        "traderid": "569335",
        "tradername": "Rohan",
        "networth": 30000
    },
    {
        "traderid": "335016",
        "tradername": "Barry",
        "networth": 30000
    }
]
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

