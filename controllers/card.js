const Card = require("../models/user");
const {
  NOT_FOUND_ERROR,
  CAST_ERROR,
  ERROR,
  OK,
} = require("../constants/constants");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => {
      res.status(ERROR).send({
        message: "Произошла ошибка.",
      });
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR).send({
          message: "Карточка с указанным id не найдена.",
        });
      }
      card.delete();
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные для удаления карточки.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((like) => {
      if (!like) {
        res.status(NOT_FOUND_ERROR).send({
          message: "Передан несуществующий id карточки.",
        });
      }
      res.status(OK).send(like);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((like) => {
      if (!like) {
        res.status(NOT_FOUND_ERROR).send({
          message: "Передан несуществующий id карточки.",
        });
      }
      res.status(OK).send(like);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные для снятии лайка.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
