const router = require("express").Router();
const { celebrate, Joi, errors } = require("celebrate");
const auth = require("../middlewares/auth");
const userRoutes = require("./user");
const cardsRoutes = require("./card");
const { createUser, login } = require("../controllers/user");

router.use("/users", auth, userRoutes);
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);
router.use("/cards", auth, cardsRoutes);

router.use(errors());

router.use((err, req, res, next) => {
  res.status(500).send({ message: "На сервере произошла ошибка" });
  next(err);
});

module.exports = router;
