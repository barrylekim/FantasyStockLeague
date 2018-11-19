# INVESTED

Return an array of tradernames who have bought company x

**URL** : `http://localhost:3005/invested/:companyid`

**Method** : `GET`

**Data constraints**

Provide the ID of the company in the URL.

**Data example** All fields must be sent.

**URL** : `http://localhost:3005/invested/UN`

## Success Response

**Condition** : If everything is OK and stock purchase was successful.

**Code** : `200 OK`

**Content example**

[
    {
        "tradername": "Rohan"
    },
    {
        "tradername": "Barry"
    }
]

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`