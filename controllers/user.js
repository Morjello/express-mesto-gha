const User = require("../models/user");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        return res.status(404).send({
          message: "Пользователи не найдены.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

const getUserById = (req, res) => {
  const user = req.params.userId;
  User.findById(user)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Пользователь по указанному _id не найден.",
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (!user) {
        return res.status(400).send({
          message: "Переданы некорректные данные пользователя.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

const createUser = (req, res) => {
  const _id = req.user._id;
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar, _id })
    .then(() => res.status(200).send({ name, about, avatar, _id }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true }
  )
    .then(() => {
      res.status(200).send({ name, about });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

const updateUserAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar })
    .then(() => {
      res.status(200).send({ avatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      res.status(500).send({
        message: "Произошла ошибка.",
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
