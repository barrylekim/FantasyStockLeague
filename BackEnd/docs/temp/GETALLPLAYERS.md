# Get all players

Get all players in the game.

**URL** : `http://localhost:3005/getAllPlayers`

**Method** : `GET`

**Data constraints**

None.

## Success Response

**Condition** : If everything is OK and stock purchase was successful.

**Code** : `200 OK`

**Content example**

[
    "Barry",
    "Rohan",
    "Jason",
    "Diego"
]

## Error Response

**Condition** : If database query encountered an error.

**Code** : `500 Internal Server Error`

**Content** : `{error: error message}`