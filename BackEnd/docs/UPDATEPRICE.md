# Update Stock PRices

Call the iExTrading API to update to price of all stocks in the database

**URL** : `http://localhost:3005/udpatePrice`

**Method** : `GET`

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/updatePrice`

## Success Response

**Condition** : If everything is OK and price were updated.

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Company prices updated"
}
```

## Error Response

No error responses.