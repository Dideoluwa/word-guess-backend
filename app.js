const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("working");
  console.log("App working");
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server Running at 8000`);
});
