# Add to a player's watchlist

If the player is interested in a company but don't want to buy yet, the player can add it to their watchlist.

**URL** : `http://localhost:3005/addToWatchList`

**Method** : `POST`

**Data constraints**

Provide the name of the trader and the company ID

```json
{
    "name": "Name of the player",
    "CID": "the companyID"
}
```

**Data example** All fields must be sent.

```json
{
    "name": "Barry",
    "CID": "AMZN"
}
```

## Success Response

**Condition** : If everything is OK and trader list returned.

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Company added to watchlist"
}
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

