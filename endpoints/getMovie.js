const express = require("express");
const router = express.Router();

const { getMovies } = require("../data/db");

router.get("/getmovie", async (req, res) => {
  try {
    const movieList = await getMovies();
    let requestedDuration = req.query.duration;
    let requestedGenres = req.query.genres;
    let responseData = await selectMovies(
      movieList,
      requestedDuration,
      requestedGenres
    );

    if (responseData) {
      res.json(responseData);
    } else {
      res.json({ error: "no movie matching given criteria found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;

module.exports.selectMovies = selectMovies = async (
  movieList,
  requestedDuration,
  requestedGenres
) => {
  //there are no movies on the list, we can't get any :(
  if (movieList.length === 0) return false;

  if (requestedGenres) {
    //get all movies that have any genre that we're looking for
    let data = movieList.filter((m) =>
      requestedGenres.some((g) => m.genres.includes(g))
    );

    //filter movies that don't match requested duration
    if (requestedDuration) {
      data = data.filter(
        (m) =>
          m.runtime >= requestedDuration - 10 &&
          m.runtime <= parseInt(requestedDuration) + 10
      );
    }

    data.sort((a, b) => {
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

    return data.length > 0 ? data : false;
  } else {
    if (requestedDuration) {
      //only duration parameter provided, return movie from duration range
      let filteredMovieList = movieList.filter(
        (m) =>
          m.runtime >= requestedDuration - 10 &&
          m.runtime <= parseInt(requestedDuration) + 10
      );

      return filteredMovieList.length > 0
        ? filteredMovieList[
            Math.floor(Math.random() * filteredMovieList.length)
          ]
        : false;
    } else {
      //no parameters provided, return a random movie
      return movieList[Math.floor(Math.random() * movieList.length)];
    }
  }
};

calculateGenreValue = (requestedGenres, movieGenres) => {
  //we'll assign each genre a value equal to it's index and sum them up
  //since the lowest index is the most important, we're looking for the lowest value
  let sum = 0;
  for (const genre of movieGenres) {
    if (requestedGenres.includes(genre)) sum += requestedGenres.indexOf(genre);
  }

  return sum;
};
