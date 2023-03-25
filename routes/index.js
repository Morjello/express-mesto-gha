const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
const userRoutes = require("./user");
const cardsRoutes = require("./card");
const { createUser, login } = require("../controllers/user");
const NotFoundError = require("../errors/not-found-err");
const { HTTPSAVE } = require("../utils/constants");

// логин
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(2).pattern(HTTPSAVE),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

// регистрация
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(HTTPSAVE),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

router.use("/users", auth, userRoutes);
router.use("/cards", auth, cardsRoutes);

router.use((req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

router.use((err, req, res, next) => {
  res.send({ message: err.message });
  next();
});

module.exports = router;
