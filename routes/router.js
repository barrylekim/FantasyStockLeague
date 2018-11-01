var router = express.Router();
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: prcoess.env.STOCK
});

connection.connect();

//connection.query("SELECT * from temp", function( err, results, fields) {})
router.get("/", (req, res) => {
    res.send("HELLO");
});