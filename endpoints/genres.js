const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

const databasePath = "./data/db.json";

router.get("/genres", async (req, res) => {
  try {
    const rawMovieDatabase = await fs.readFile(databasePath);
    const genres = JSON.parse(rawMovieDatabase).genres;
    res.json(genres);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;
