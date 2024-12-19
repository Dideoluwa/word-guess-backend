const express = require("express");
const wordGuessRouter = express.Router();
const { getHints, getWords } = require("../controllers/wordGuess.controller");

wordGuessRouter.get("/word-guess/hint", getHints);
wordGuessRouter.get("/word-guess/word-of-the-day", getWords);

module.exports = wordGuessRouter;
