# Update Price

Update the share price of every company, creates a new entry in the price table with a new price ID and updates the priceID of every company.

**URL** : `http://localhost:3005/updatePrice`

**Method** : `GET`

**Data constraints**

None.


## Success Response

**Condition** : If everything is OK and stock purchase was successful.

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Company prices updated"
}
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`