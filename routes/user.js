const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/user");

// получаем всех пользователей
router.get("/", getUsers);

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

// получаем данные текущего пользователя
router.get("/me", getCurrentUser);

// обновляем имя и описание пользователя
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser
);

// обновляем аватар
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      ),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
