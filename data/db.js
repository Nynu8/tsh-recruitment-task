const fs = require("fs").promises;
const filePath = "./data/db.json";

module.exports.getMovies = async () => {
  try {
    const rawData = await fs.readFile(filePath);
    return JSON.parse(rawData).movies;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports.getGenres = async () => {
  try {
    const rawData = await fs.readFile(filePath);
    return JSON.parse(rawData).genres;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports.addMovie = async (movie) => {
  try {
    const rawData = await fs.readFile(filePath);
    let data = JSON.parse(rawData);
    movie.id = data.movies[data.movies.length - 1].id + 1;
    data.movies.push(movie);
    await fs.writeFile(filePath, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
