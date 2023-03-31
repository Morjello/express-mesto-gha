const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const NotFoundError = require("../errors/not-found-err");
const ValidationError = require("../errors/validation-error");
const AuthError = require("../errors/auth-error");
const ConflictError = require("../errors/conflict-error");
const User = require("../models/user");
const { OK } = require("../utils/constants");

// получаем всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

// получаем пользователя по id
const getUserById = (req, res, next) => {
  const user = req.params.userId;
  User.findById(user)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      } else {
        res.status(OK).send(userData);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new ValidationError("Переданы некорректные данные пользователя.")
        );
      }
      next(err);
    });
};

// получаем текущего пользователя
const getCurrentUser = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден.");
      }
      res.status(OK).send(user);
    })
    .catch((err) => next(err));
};

// создаем нового пользователя /signup
const createUser = (req, res, next) => {
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
      });
    })
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Такой пользователь уже есть"));
      }
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при обновлении аватара."
          )
        );
      }
      next(err);
    });
};

// лагинимся /signin
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
      res.send({ user, token });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return next(new AuthError("Неправильные почта или пароль"));
      }
    })
    .catch((err) => {
      next(err);
    });
};

// обновляем инфу о пользователе
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
        return next(
          new ValidationError(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
      }
      next(err);
    });
};

// обновляем аватар пользовтеля
const updateUserAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar })
    .then(() => {
      res.status(OK).send({ avatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при обновлении аватара."
          )
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
