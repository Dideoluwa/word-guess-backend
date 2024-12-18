const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const wordGuessRouter = require("./routes/wordGuess");
const functions = require("firebase-functions");
require("./scripts/cronJob");
require("./config/database");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

app.use("/api/v1", wordGuessRouter);

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hi",
  });
});
// const PORT = process.env.PORT || 2109;
app.listen(2109, () => {
  console.log(`Server is running on port ${2109}`);
});

exports.word_guess_api = functions.https.onRequest(app);
