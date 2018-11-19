# Largest Share

Get the player witht he largest share in a given company.

**URL** : `http://localhost:3005/largestShare/:id`

**Method** : `GET`

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/largestShare/AAPL`

## Success Response

**Condition** : If everything is OK and trader was returned.

**Code** : `200 OK`

**Content example**

```json
{
    "traderid": "335016",
    "companyid": "UN",
    "total": "100",
    "tradername": "Barry"
}
```

## Error Response

**Condition** : If trader could not be produced

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

