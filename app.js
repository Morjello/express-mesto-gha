const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");

const routes = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { PORT, DB_ADRESS } = require("./config");

const app = express();

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
});
mongoose.set("strictQuery", false);

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`work on ${PORT}`);
});
