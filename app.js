const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const wordGuessRouter = require("./routes/wordGuess");
require("./scripts/cronJob");
require("./config/database");

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

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server Running at 8000`);
});
