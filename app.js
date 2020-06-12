const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;

app.use(bodyParser.json());

//get a movie
const getMovie = require("./endpoints/getMovie");
app.use(getMovie);

//add a movie
const addMovie = require("./endpoints/addMovie");
app.use(addMovie);

//get list of genres
const genres = require("./endpoints/genres");
app.use(genres);

app.listen(port, () => console.log(`App listening on port ${port}`));
