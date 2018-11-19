# Most expensive company

Return the company that has the highest price per share.

**URL** : `http://localhost:3005/companyHighest`

**Method** : `GET`

**Data constraints**

None.

## Success Response

**Condition** : If everything is OK and trader list returned.

**Code** : `200 OK`

**Content example**

```json
{
    "companyid": "AMZN",
    "numofshares": 6055485,
    "industry": "Retail - Apparel & Specialty",
    "companyname": "Amazon.com Inc.",
    "pdate": "Sun Nov 18 2018 16:52:13 GMT-0800 (PST)",
    "value": 1593.41,
    "changepercent": -0.01607
}
```

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`

