const User = require("../models/user");
const {
  NOT_FOUND_ERROR,
  CAST_ERROR,
  ERROR,
} = require("../constants/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        res.status(NOT_FOUND_ERROR).send({
          message: "Пользователи не найдены.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

const getUserById = (req, res) => {
  const user = req.params.userId;
  User.findById(user)
    .then(() => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({
          message: "Пользователь по указанному _id не найден.",
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные пользователя.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

const createUser = (req, res) => {
  const owner = req.user._id;
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar,
    owner,
  })
    .then(() => {
      res.status(200).send({
        name,
        about,
        avatar,
        owner,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
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
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
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
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      } else {
        res.status(ERROR).send({
          message: "Произошла ошибка.",
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
