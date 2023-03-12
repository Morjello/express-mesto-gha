const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParse = require("body-parser");
const routes = require("./routes/index");
const NOT_FOUND_ERROR = require("./constants/constants");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/mestodb", {
  useNewUrlParser: true,
});
mongoose.set("strictQuery", false);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParse.json());
app.use((req, res, next) => {
  req.user = {
    _id: "64061af81368a7512037c44b",
  };

  next();
});
app.use(routes);
app.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({
    message: "Страница не найдена.",
  });
});

app.listen(PORT, () => {
  console.log(`work on ${PORT}`);
});
