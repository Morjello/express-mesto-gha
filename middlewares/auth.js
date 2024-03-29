const jwt = require("jsonwebtoken");
const AuthError = require("../errors/auth-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return next(new AuthError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};

module.exports = auth;
