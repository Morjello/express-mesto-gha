const Card = require("../models/card");
const ValidationError = require("../errors/validation-error");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-error");
const { OK } = require("../utils/constants");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при создании карточки."
          )
        );
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Карточка с указанным id не найдена."));
      }
      if (card.owner.toString() !== req.user._id) {
        next(
          new ForbiddenError(
            "Вы не можете удалить карточку другого пользователя"
          )
        );
      }
      res.status(OK).send(card);
      return null;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для удаления карточки."
          )
        );
      }
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
        return next(new NotFoundError("Передан несуществующий id карточки."));
      }
      res.status(OK).send(like);
      return null;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для постановки лайка."
          )
        );
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((like) => {
      if (!like) {
        return next(new NotFoundError("Передан несуществующий id карточки."));
      }
      res.status(OK).send(like);
      return null;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError("Переданы некорректные данные для снятии лайка.")
        );
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
