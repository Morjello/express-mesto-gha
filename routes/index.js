const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRoutes = require("./user");
const cardsRoutes = require("./card");
const { createUser, login } = require("../controllers/user");

router.use("/users", userRoutes);
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/cards", cardsRoutes);

module.exports = router;
