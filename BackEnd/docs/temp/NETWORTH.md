# Net worth

Given a trader name, get the net worth of that player based on his investments and the current value

**URL** : `http://localhost:3005/netWorth`

**Method** : `GET`

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

30000

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`