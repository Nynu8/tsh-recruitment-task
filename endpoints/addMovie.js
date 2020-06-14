const express = require("express");
const { check, validationResult, oneOf } = require("express-validator");
const router = express.Router();

const { getGenres, addMovie } = require("../data/db");

router.post(
  "/addmovie",
  [
    check("genres").custom(async (genres) => {
      if (genres) {
        const availableGenres = await getGenres();
        if (availableGenres) {
          let invalidGenres = genres.filter(
            (g) => !availableGenres.includes(g)
          );
          if (invalidGenres.length > 0) {
            throw `${invalidGenres.join(", ")} are not valid genres`;
          }
        }
      } else {
        throw "Genres can't be empty";
      }
    }),
    check("title")
      .exists()
      .withMessage("Title can't be empty")
      .bail()
      .isLength({ max: 255 })
      .withMessage("Title can't be longer than 255 characters"),
    check("year")
      .exists()
      .withMessage("Year can't be empty")
      .bail()
      .isNumeric()
      .withMessage("Year has to be a number"),
    check("runtime")
      .exists()
      .withMessage("Runtime can't be empty")
      .bail()
      .isNumeric()
      .withMessage("Runtime has to be a number"),
    check("director")
      .exists()
      .withMessage("Director can't be empty")
      .bail()
      .isLength({ max: 255 })
      .withMessage("Director can't be longer than 255 characters"),
    oneOf([
      check("actors").isEmpty(),
      check("actors").isString().withMessage("Actors have to be a string"),
    ]),
    oneOf([
      check("plot").isEmpty(),
      check("plot").isString().withMessage("Plot has to be a string"),
    ]),
    oneOf([
      check("posterUrl").isEmpty(),
      check("posterUrl").isString().withMessage("posterUrl has to be a string"),
    ]),
  ],
  async (req, res) => {
    try {
      validationResult(req).throw();
      if (
        await addMovie({
          title: req.body.title,
          year: req.body.year,
          runtime: req.body.runtime,
          genres: req.body.genres,
          directors: req.body.directors,
          actors: req.body.actors ?? "",
          plot: req.body.plot ?? "",
          posterUrl: req.body.posterUrl ?? "",
        })
      ) {
        res.json("success");
      } else {
        res.status(500).end();
      }
    } catch (e) {
      res.status(400).json(e.errors);
    }
  }
);

module.exports = router;
