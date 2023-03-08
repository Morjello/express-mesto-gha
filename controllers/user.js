const User = require("../models/user");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

const getUsers = (req, res, next) => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        next(new NotFoundError("Пользователи не найдены"));
        return;
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const getUserId = (req, res, next) => {
  const user = req.params.userId;
  User.findById(user)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (!user) {
        next(new NotFoundError("Пользователь по указанному id не найден."));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ name, about, avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при создании пользователя."
          )
        );
        return;
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const updateUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about })
    .then(() => res.status(200).send({ name, about }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
        return;
      }
      if (err.name === "NotFoundError") {
        next(NotFoundError("Пользователь по указанному id не найден."));
        return;
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

const updateUserAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar })
    .then(() => res.status(200).send({ avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при обновлении аватара."
          )
        );
        return;
      }
      if (err.name === "NotFoundError") {
        next(new NotFoundError("Пользователь по указанному id не найден."));
        return;
      }
      next(
        new Error(`Произошла неизвестная ошибка ${err.name}: ${err.message}`)
      );
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateUserAvatar,
};
