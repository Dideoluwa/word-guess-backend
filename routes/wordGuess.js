const express = require("express");
const wordGuessRouter = express.Router();
const { getHints } = require("../controllers/wordGuess.controller");

wordGuessRouter.get("/word-guess/hint", getHints);

module.exports = wordGuessRouter;
