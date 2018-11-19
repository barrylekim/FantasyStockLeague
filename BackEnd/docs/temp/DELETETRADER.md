# Delete a trader

Delete the trader with the given name.

**URL** : `http://localhost:3005/deleteTrader`

**Method** : `POST`

**Data constraints**

Provide the name of a trader.

```json
{
    "name": "name of a trader"
}
```

**Data example** All fields must be sent.

```json
{
    "name": "Barry"
}
```

## Success Response

**Condition** : If everything is OK and stock purchase was successful.

**Code** : `200 OK`

**Content example**

{message: "trader deleted"}

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`