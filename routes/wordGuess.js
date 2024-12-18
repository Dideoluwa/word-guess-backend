const express = require("express");
const wordGuessRouter = express.Router();
const {
  getHints,
  getWords,
  testController,
} = require("../controllers/wordGuess.controller");

wordGuessRouter.get("/word-guess/hint", getHints);
wordGuessRouter.get("/word-guess/word-of-the-day", getWords);
wordGuessRouter.get("/word-guess/test", testController);

module.exports = wordGuessRouter;
