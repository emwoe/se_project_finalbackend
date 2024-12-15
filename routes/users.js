const router = require("express").Router();

const { getCurrentUser, editUserProfile } = require("../controllers/users");
const auth = require("../middleware/auth");

router.get("/users/me", auth, getCurrentUser);

module.exports = router;
