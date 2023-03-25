const jwt = require("jsonwebtoken");
const AuthError = require("../errors/auth-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AuthError("Необходима авторизация");
    }

    const token = authorization.replace("Bearer ", "");
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    next(new AuthError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};

module.exports = auth;
