const router = require("express").Router();
const cors = require("cors");

const {
  getTopics,
  createNewTopic,
  deleteTopic,
} = require("../controllers/studyTopics");

const auth = require("../middleware/auth");

const { validateTopicBody } = require("../middleware/validation");

router.use(cors());

router.get("/topics", auth, getTopics);
router.post("/topics", auth, validateTopicBody, createNewTopic);
router.delete("/topics/:id", auth, deleteTopic);

module.exports = router;
