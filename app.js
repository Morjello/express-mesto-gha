const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/index");
const { PORT, DB_ADRESS } = require("./config");

const app = express();

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
});
mongoose.set("strictQuery", false);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`work on ${PORT}`);
});
