const router = require("express").Router();
const cors = require("cors");

const {
  getTopics,
  createNewTopic,
  deleteTopic,
} = require("../controllers/studyTopics");

const auth = require("../middleware/auth");

router.use(cors());

/*

router.get("/topics", auth, getTopics);


router.post("/topics", auth, createNewTopic);

router.delete("/topics/:id", auth, deleteTopic);
*/
module.exports = router;
