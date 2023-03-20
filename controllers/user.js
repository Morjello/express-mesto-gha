const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NotFoundError } = require("../errors/not-found-err");
const User = require("../models/user");
const {
  NOT_FOUND_ERROR,
  CAST_ERROR,
  ERROR,
  OK,
} = require("../constants/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
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

const getUserById = (req, res, next) => {
  const user = req.params.userId;
  User.findById(user)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      res.status(OK).send(userData);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные пользователя.",
        });
      }
      next(err);
    });
};

const createUser = (req, res) => {
  const { _id } = req.user._id;
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
        _id,
      })
    )
    .then((user) => {
      res.status(OK).send(user);
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

const getCurrentUser = (req, res, next) => {
  const user = req.params.userId;
  User.findById(user)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      res.status(OK).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        Promise.reject(new Error("Неправильные почта или пароль"));
      }
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({ token });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        Promise.reject(new Error("Неправильные почта или пароль"));
      }
    })
    .catch(() => {
      res.status(401).send({ message: "Неправильные почта или пароль" });
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
      res.status(OK).send({ name, about });
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
      res.status(OK).send({ avatar });
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
  login,
  getCurrentUser,
};
