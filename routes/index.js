const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
/*
const {
  validateUserBody,
  validateLoginBody,
} = require("../middleware/validation");
 */

router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
