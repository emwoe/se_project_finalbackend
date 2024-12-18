const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../errors/unauthorized-error");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

module.exports.createUser = (req, res, next) => {
  const { username, email, password, passwordcheck } = req.body;
  if (!email) {
    throw new BadRequestError("Email is required");
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error("Email already registered"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        username,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res
        .status(201)
        .send({ username: user.username, email: user.email, _id: user._id })
    )
    .catch((err) => {
      console.error();
      if (err.message === "Email already registered") {
        next(new ConflictError("Email already registered"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Please enter a properly formatted email."));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Both email and password are required.");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const usertoken = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log(usertoken);
      const userdata = {
        username: user.username,
        email: user.email,
        _id: user._id,
      };
      console.log(userdata);

      res.send({ userdata, usertoken });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password.") {
        next(new UnauthorizedError("Incorrect email or password."));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  console.log("Current user is");
  console.log(req.user._id);
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User ID not found.");
    })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        next(new NotFoundError("User not found."));
      } else {
        next(err);
      }
    });
};
