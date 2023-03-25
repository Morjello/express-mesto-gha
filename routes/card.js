const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { HTTPSAVE } = require("../utils/constants");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/card");

// получаем все карточки
router.get("/", getCards);

// создаем карточку
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(HTTPSAVE),
    }),
  }),
  createCard
);

// удаляем карточку
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCard
);

// ставим лайк
router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  likeCard
);

// убираем лайк
router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
