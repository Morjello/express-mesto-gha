const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { HTTPSAVE } = require("../utils/constants");
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require("../controllers/user");

// получаем всех пользователей
router.get(
  "/",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  getUsers
);

// получаем данные текущего пользователя
router.get("/me", getCurrentUser);

// получаем пользователя по id
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  getUserById
);

// обновляем имя и описание пользователя
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

// обновляем аватар
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(HTTPSAVE),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
