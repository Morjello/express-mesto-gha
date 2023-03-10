const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        return res.status(404).send({
          message: "Карточки не найдены.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

const createCard = (req, res) => {
  const _id = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, _id })
    .then(() => res.status(200).send({ name, link, _id }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

const deleteCard = (req, res) => {
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
      res.status(500).send({
        message: "Произошла ошибка.",
      });
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
        return res.status(404).send({
          message: "Передан несуществующий id карточки.",
        });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      }

      res.status(500).send({
        message: "Произошла ошибка.",
      });
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
        return res.status(404).send({
          message: "Передан несуществующий id карточки.",
        });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для снятии лайка.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
