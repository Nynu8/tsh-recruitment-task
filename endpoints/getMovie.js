const express = require("express");
const router = express.Router();

const { getMovies } = require("../data/db");

router.get("/getmovie", async (req, res) => {
  try {
    const movieList = await getMovies();
    let requestedDuration = req.query.duration;
    let requestedGenres = req.query.genres;
    let responseData;
    if (requestedGenres) {
      //get all movies that have any genre that we're looking for
      responseData = movieList.filter((m) =>
        requestedGenres.some((g) => m.genres.includes(g))
      );

      //filter movies that don't match requested duration
      if (requestedDuration) {
        responseData = responseData.filter(
          (m) =>
            m.runtime > requestedDuration - 10 &&
            m.runtime < parseInt(requestedDuration) + 10
        );
      }

      responseData.sort((a, b) => {
        const s =
          b.genres.filter((g) => requestedGenres.includes(g)).length -
          a.genres.filter((g) => requestedGenres.includes(g)).length;

        //both movies have the same number of genres, sort by genre weight
        if (s == 0) {
          return (
            calculateGenreValue(requestedGenres, a.genres) -
            calculateGenreValue(requestedGenres, b.genres)
          );
        }

        return s;
      });
    } else {
      if (requestedDuration) {
        //only duration parameter provided, return movie from duration range
        let filteredMovieList = movieList.filter(
          (m) =>
            m.runtime > requestedDuration - 10 &&
            m.runtime < parseInt(requestedDuration) + 10
        );

        responseData =
          filteredMovieList[
            Math.floor(Math.random() * filteredMovieList.length)
          ];
      } else {
        //no parameters provided, return a random movie
        responseData = movieList[Math.floor(Math.random() * movieList.length)];
      }
    }

    res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;

calculateGenreValue = (requestedGenres, movieGenres) => {
  //we'll assign each genre a value equal to it's index and sum them up
  //since the lowest index is the most important, we're looking for the lowest value
  let sum = 0;
  for (const genre of movieGenres) {
    if (requestedGenres.includes(genre)) sum += requestedGenres.indexOf(genre);
  }

  return sum;
};
