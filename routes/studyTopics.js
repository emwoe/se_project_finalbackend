const router = require("express").Router();
const cors = require("cors");

const {
  getTopics,
  createNewTopic,
  deleteTopic,
} = require("../controllers/studyTopics");

const auth = require("../middleware/auth");

router.use(cors());

router.get("/topics", getTopics);
router.post("/topics", createNewTopic);
router.delete("/topics/:id", deleteTopic);

module.exports = router;
