const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParse = require("body-parser");
const routes = require("./routes/index");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/mestodb", {
  useNewUrlParser: true,
});
mongoose.set("strictQuery", false);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParse.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`work on ${PORT}`);
});
