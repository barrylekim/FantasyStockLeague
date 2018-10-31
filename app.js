const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var routes = require('./router/routes');
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});