const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

const getCards = (req, res, next) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        return res.status(404).send({
          message: "Карточки не найдены.",
        });
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const createCard = (req, res, next) => {
  const _id = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, _id })
    .then(() => res.status(200).send({ name, link, _id }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: "Карточка с указанным id не найдена.",
        });
      }
      card.delete();
      res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((like) => {
      if (!req.params.cardId) {
        return res.status(404).send({
          message: "Передан несуществующий id карточки.",
        });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((like) => {
      if (!req.params.cardId) {
        return res.status(404).send({
          message: "Передан несуществующий id карточки.",
        });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для снятии лайка.",
        });
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
