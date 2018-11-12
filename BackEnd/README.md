**StockWatch API**
----
Backend API for StockWatch - A fantasy stock league. 

* **URL**

  <http://localhost:3005/buy>

* **Method:**
  
  <_`POST`_>

* **Data Params**

  <_traderID, companyID, numOfShares_>

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message : x shares of <companyID> purchased }`
 
* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ error : Server Error }`

* **Sample Call:**

  <_$.ajax({
      url: "http://localhost:3005/buy",
      dataType: "json",
      data: {
        "companyID": "AAPL",
        "traderID": "717",
        "numOfShares": "20"
      },
      type: "POST"
    });_>
