const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NotFoundError } = require("../errors/not-found-err");
const { ValidationError } = require("../errors/validation-error");
const { AuthError } = require("../errors/auth-error");
const User = require("../models/user");
const { OK } = require("../constants/constants");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        throw new NotFoundError("Пользователи не найдены.");
      }
      next(err);
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
        throw new ValidationError("Переданы некорректные данные пользователя.");
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { _id } = req.user._id;
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
        _id,
      });
    })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.code === 1100) {
        throw new Error("Такой пользователь уже есть");
      } else if (err.name === "ValidationError") {
        throw new ValidationError(
          "Переданы некорректные данные при обновлении аватара."
        );
      } else {
        next(err);
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
      if (err.code === 1100) {
        throw new Error("Такой пользователь уже есть");
      } else if (err.name === "ValidationError") {
        throw new ValidationError(
          "Переданы некорректные данные при обновлении аватара."
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError("Неправильные почта или пароль");
      }
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({ token });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new AuthError("Неправильные почта или пароль");
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
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
        throw new ValidationError(
          "Переданы некорректные данные при обновлении профиля."
        );
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar })
    .then(() => {
      res.status(OK).send({ avatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError(
          "Переданы некорректные данные при обновлении аватара."
        );
      }
      next(err);
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
