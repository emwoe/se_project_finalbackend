const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const { getCurrentUser } = require("../controllers/users");
const auth = require("../middleware/auth");

const UnauthorizedError = require("../errors/unauthorized-error");

const testAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No authorization header");
    return next(new UnauthorizedError("Authorization header required"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded);
  } catch (err) {
    console.error("Token verification failed:", err);
    return next(new UnauthorizedError("Invalid token"));
  }

  next();
};

router.get("/users/me", auth, getCurrentUser);

module.exports = router;
