# Add a trader

Create a new trader with the given name. The trader will have a starting fund of $30,000 with a personal portfolio and added to the leaderboard. The trader will also have a personal watchlist.


**URL** : `http://localhost:3005/addTrader`

**Method** : `POST`

**Data constraints**

Provide username of trader. Username must be unique.

```json
{
    "name": "enter unique username"
}
```

**Data example** All fields must be sent.

```json
{
    "name": "michaeljackson123"
}
```

## Success Response

**Condition** : If trader is added, portfolio and watchlist is created and leaderboard is updated.

**Code** : `200 OK`

**Content example**

```json
{
    "traderid": 41904
}
```

## Error Response

**Condition** : If req body is missing information or invalid.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`
