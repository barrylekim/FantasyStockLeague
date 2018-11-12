**StockWatch API**
----
Backend API for StockWatch - A fantasy stock league. 

* **URL**

  <http://localhost:3005/buy>
C:\Users\Jason\desktop\CPSC 304\FantasyStockLeague\BackEnd\package.json
* **Method:**
  
  <_`POST`_>

* **Data Params**

  <_traderID, companyID, numOfShares_>

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message : x shares of <companyID> purchased }`
 
* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error : Server Error }`

* **Sample Call:**

  <_$.ajax({ 
      "companyID": "AAPL",
      "traderID": "717",
      "numOfShares": "20"
    });_>
