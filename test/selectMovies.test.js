const { expect } = require("chai");
const { selectMovies } = require("../endpoints/getMovie");

describe("selectMovie tests", () => {
  describe("No genres or duration given", () => {
    it("Empty movie list - should return false", async () => {
      let movieList = [];
      let selectedMovie = await selectMovies(movieList);
      expect(selectedMovie).equal(false);
    });

    it("Only one movie - should return that movie", async () => {
      let movieList = [{ title: "Movie1" }];
      let selectedMovie = await selectMovies(movieList);
      expect(selectedMovie).equal(movieList[0]);
    });

    it("Multiple movies - should return one of them", async () => {
      let movieList = [
        { title: "Movie1" },
        { title: "Movie2" },
        { title: "Movie3" },
      ];
      let selectedMovie = await selectMovies(movieList);
      expect(selectedMovie).to.be.oneOf(movieList);
    });
  });

  describe("Only duration given", () => {
    it("Empty movie list - should return false", async () => {
      let movieList = [];
      let selectedMovie = await selectMovies(movieList, 10);
      expect(selectedMovie).equal(false);
    });

    it("One movie within requested time - should return that movie", async () => {
      let movieList = [{ runtime: 15 }];
      let selectedMovie = await selectMovies(movieList, 10);
      expect(selectedMovie).equal(movieList[0]);
    });

    it("One movie outside of time range - should return false", async () => {
      let movieList = [{ runtime: 25 }];
      let selectedMovie = await selectMovies(movieList, 10);
      expect(selectedMovie).equal(false);
    });

    it("Multiple movies some within time range - should return one of them", async () => {
      let movieList = [
        { runtime: 25 },
        { runtime: 5 },
        { runtime: 24 },
        { runtime: 13 },
      ];

      let moviesWithinRange = [movieList[1], movieList[3]];

      let selectedMovie = await selectMovies(movieList, 10);
      expect(selectedMovie).to.be.oneOf(moviesWithinRange);
    });

    it("Multiple movies none within time range - should return false", async () => {
      let movieList = [
        { runtime: 25 },
        { runtime: 32 },
        { runtime: 24 },
        { runtime: 22 },
      ];

      let selectedMovie = await selectMovies(movieList, 10);
      expect(selectedMovie).equal(false);
    });
  });

  describe("Only genres tests", () => {
    it("Empty movie list - should return false", async () => {
      let movieList = [];
      let selectedMovie = await selectMovies(movieList, null, ["Genre1"]);
      expect(selectedMovie).equal(false);
    });

    it("One movie with matching genre - should return that movie", async () => {
      let movieList = [{ genres: ["genre1"] }];
      let selectedMovie = await selectMovies(movieList, null, ["genre1"]);
      expect(selectedMovie).to.have.deep.members([{ genres: ["genre1"] }]);
    });

    it("One movie without maching genre - should return false", async () => {
      let movieList = [{ genres: ["genre2"] }];
      let selectedMovie = await selectMovies(movieList, null, ["genre1"]);
      expect(selectedMovie).equal(false);
    });

    it("Multiple movies without maching genre - should return false", async () => {
      let movieList = [
        { genres: ["genre2"] },
        { genres: ["genre3"] },
        { genres: ["genre4"] },
      ];
      let selectedMovie = await selectMovies(movieList, null, ["genre1"]);
      expect(selectedMovie).equal(false);
    });

    it("Multiple movies with one matching genre - should return that movie", async () => {
      let movieList = [
        { genres: ["genre2"] },
        { genres: ["genre3"] },
        { genres: ["genre1"] },
        { genres: ["genre4"] },
      ];
      let selectedMovie = await selectMovies(movieList, null, ["genre1"]);
      expect(selectedMovie).to.have.deep.members([{ genres: ["genre1"] }]);
    });

    it("Multiple movies with multiple matching genres (1) - should return movies in correct order", async () => {
      let movieList = [
        { genres: ["genre1", "genre2"] },
        { genres: ["genre3"] },
        { genres: ["genre1"] },
        { genres: ["genre4"] },
      ];
      let selectedMovie = await selectMovies(movieList, null, [
        "genre1",
        "genre2",
      ]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre1", "genre2"] },
        { genres: ["genre1"] },
      ]);
    });

    it("Multiple movies with multiple matching genres (2) - should return movies in correct order", async () => {
      let movieList = [
        { genres: ["genre2", "genre3"] },
        { genres: ["genre1", "genre2"] },
        { genres: ["genre1"] },
        { genres: ["genre3", "genre4"] },
        { genres: ["genre4"] },
      ];
      let selectedMovie = await selectMovies(movieList, null, [
        "genre1",
        "genre2",
        "genre3",
      ]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre1", "genre2"] },
        { genres: ["genre2", "genre3"] },
        { genres: ["genre1"] },
        { genres: ["genre3", "genre4"] },
      ]);
    });

    it("Multiple movies with multiple matching genres (3) - should return movies in correct order", async () => {
      let movieList = [
        { genres: ["genre2", "genre3"] },
        { genres: ["genre3"] },
        { genres: ["genre1", "genre3", "genre4"] },
        { genres: ["genre1", "genre2"] },
        { genres: ["genre1"] },
        { genres: ["genre3", "genre4"] },
        { genres: ["genre2", "genre3", "genre1", "genre4"] },
      ];
      let selectedMovie = await selectMovies(movieList, null, [
        "genre1",
        "genre2",
        "genre3",
      ]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre2", "genre3", "genre1", "genre4"] },
        { genres: ["genre1", "genre2"] },
        { genres: ["genre1", "genre3", "genre4"] },
        { genres: ["genre2", "genre3"] },
        { genres: ["genre1"] },
        { genres: ["genre3"] },
        { genres: ["genre3", "genre4"] },
      ]);
    });
  });

  describe("Duration and genres tests", () => {
    it("Empty movie list - should return false", async () => {
      let movieList = [];
      let selectedMovie = await selectMovies(movieList, 10, ["Genre1"]);
      expect(selectedMovie).equal(false);
    });

    it("One movie with matching genre and runtime - should return that movie", async () => {
      let movieList = [{ genres: ["genre1"], runtime: 10 }];
      let selectedMovie = await selectMovies(movieList, 15, ["genre1"]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre1"], runtime: 10 },
      ]);
    });

    it("One movie with matching genre but not runtime - should return false", async () => {
      let movieList = [{ genres: ["genre1"], runtime: 10 }];
      let selectedMovie = await selectMovies(movieList, 23, ["genre1"]);
      expect(selectedMovie).to.equal(false);
    });

    it("One movie with matching runtime but not genre - should return false", async () => {
      let movieList = [{ genres: ["genre1"], runtime: 10 }];
      let selectedMovie = await selectMovies(movieList, 15, ["genre2"]);
      expect(selectedMovie).to.equal(false);
    });

    it("Multiple movies with multiple matching genres and runtimes (1) - should return movies in correct order", async () => {
      let movieList = [
        { genres: ["genre1", "genre2"], runtime: 15 },
        { genres: ["genre3"], runtime: 10 },
        { genres: ["genre1", "genre3"], runtime: 25 },
        { genres: ["genre4"] },
      ];
      let selectedMovie = await selectMovies(movieList, 10, [
        "genre1",
        "genre2",
      ]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre1", "genre2"], runtime: 15 },
      ]);
    });

    it("Multiple movies with multiple matching genres and runtimes (2) - should return movies in correct order", async () => {
      let movieList = [
        { genres: ["genre2", "genre3"], runtime: 25 },
        { genres: ["genre1", "genre2"], runtime: 3 },
        { genres: ["genre1"], runtime: 5 },
        { genres: ["genre3", "genre4"], runtime: 20 },
        { genres: ["genre4"], runtime: 30 },
      ];
      let selectedMovie = await selectMovies(movieList, 15, [
        "genre1",
        "genre2",
        "genre3",
      ]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre2", "genre3"], runtime: 25 },
        { genres: ["genre1"], runtime: 5 },
        { genres: ["genre3", "genre4"], runtime: 20 },
      ]);
    });

    it("Multiple movies with multiple matching genres and runtimes (3) - should return movies in correct order", async () => {
      let movieList = [
        { genres: ["genre2", "genre3"], runtime: 10 },
        { genres: ["genre3"], runtime: 20 },
        { genres: ["genre1", "genre3", "genre4"], runtime: 5 },
        { genres: ["genre1", "genre2"], runtime: 5 },
        { genres: ["genre1"], runtime: 100 },
        { genres: ["genre3", "genre4"], runtime: 18 },
        { genres: ["genre2", "genre3", "genre1", "genre4"], runtime: 25 },
      ];
      let selectedMovie = await selectMovies(movieList, 10, [
        "genre1",
        "genre2",
        "genre3",
      ]);
      expect(selectedMovie).to.have.deep.members([
        { genres: ["genre1", "genre2"], runtime: 5 },
        { genres: ["genre1", "genre3", "genre4"], runtime: 5 },
        { genres: ["genre2", "genre3"], runtime: 10 },
        { genres: ["genre3"], runtime: 20 },
        { genres: ["genre3", "genre4"], runtime: 18 },
      ]);
    });
  });
});
