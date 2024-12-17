const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  console.log("auth is running");
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required.");
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new UnauthorizedError("Invalid token"));
    }
    req.user = decoded; // this will include _id from the token payload
    console.log("Decoded token:", decoded);

    next();
  });

  /*
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("Authorization required."));
  }

  req.user = payload;

  return next();

  */
};
