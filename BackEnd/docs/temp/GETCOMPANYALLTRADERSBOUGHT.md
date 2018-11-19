# Get An Array Of Companies

Get companies that all traders bought stocks from.

**URL** : `http://localhost:3005/getCompaniesAllTradersBought`

**Method** : `GET`

**Data constraints**

None.

## Success Response

**Condition** : If everything is OK and stock purchase was successful.

**Code** : `200 OK`

**Content example**

[
    {
        "companyid": "NFLX"
    }
]

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`