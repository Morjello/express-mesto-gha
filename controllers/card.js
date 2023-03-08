const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

const getCards = (req, res, next) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        next(new NotFoundError("Карточки не найдены"));
        return;
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(() => res.status(200).send({ name, link, owner }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при создании карточки."
          )
        );
        return;
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
        next(new NotFoundError("Карточка с указанным id не найдена."));
        return;
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
      if (!like) {
        next(new NotFoundError("Передан несуществующий id карточки."));
        return;
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для постановки лайка. "
          )
        );
        return;
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
    .then((like) => res.status(200).send(like))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError("Переданы некорректные данные для снятии лайка. ")
        );
        return;
      }
      if (err.name === "NotFoundError") {
        next(new NotFoundError("Передан несуществующий id карточки."));
        return;
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
