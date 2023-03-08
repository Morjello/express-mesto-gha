const router = require("express").Router();

const userRoutes = require("./user");
const cardsRoutes = require("./card");

router.use((req, res, next) => {
  req.user = {
    _id: "6401c79538604683da14a7a9",
  };

  next();
});
router.use("/users", userRoutes);
router.use("/cards", cardsRoutes);

module.exports = router;
