const express = require('express');
const routes = require('./routes');
var bodyParser = require("body-parser");
// import sequelize connection
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
});
