const express = require("express");
const wordGuessRouter = express.Router();
const {
  getHints,
  getWords,
  getWordByTimeStamp,
  dailyPlaysIncrement,
} = require("../controllers/wordGuess.controller");

wordGuessRouter.post("/word-guess/hint", getHints);
wordGuessRouter.get("/word-guess/words", getWords);
wordGuessRouter.get("/word-guess/word-of-the-day/:date", getWordByTimeStamp);
wordGuessRouter.put("/word-guess/daily-plays/:date", dailyPlaysIncrement);

module.exports = wordGuessRouter;
