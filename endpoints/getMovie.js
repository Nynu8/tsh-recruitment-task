const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

const databasePath = "data/db.json";

router.get("/getmovie", async (req, res) => {
  try {
    const rawMovieDatabase = await fs.readFile(databasePath);
    const movieList = JSON.parse(rawMovieDatabase).movies;

    console.log(req.query);
    let responseData = {};
    if (req.query.genres) {
      //handle genres search
    } else {
      if (req.query.duration) {
        let duration = req.query.duration;
        let filteredMovieList = movieList.filter((movie) => {
          return (
            movie.runtime > duration - 10 &&
            movie.runtime < parseInt(duration) + 10
          );
        });

        responseData =
          filteredMovieList[
            Math.floor(Math.random() * filteredMovieList.length)
          ];
      } else {
        responseData =
          movieDatabase[Math.floor(Math.random() * movieDatabase.length)];
      }
    }

    res.json(responseData);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
