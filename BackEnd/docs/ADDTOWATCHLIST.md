# Add a stock to trader's watchlist.

Add a stock to the given trader's watchlist, updating the includes table and list of stocks in the trader's watchlist.


**URL** : `http://localhost:3005/addtoWatchlist`

**Method** : `POST`

**Data constraints**

Provide username of trader and companyID.

```json
{
    "name": "enter unique username",
    "CID": "companyID"
}
```

**Data example** All fields must be sent.

```json
{
    "name": "rohan",
    "CID": "MSFT"
}
```

## Success Response

**Condition** : If company is added to their watchlist.

**Code** : `200 OK`

**Content example**

```json
{
    "message": "done"
}
```

## Error Response

**Condition** : If req body is missing information or invalid.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`
