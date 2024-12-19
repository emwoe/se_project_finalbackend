const mongoose = require("mongoose");

const validator = require("validator");

const studyTopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  topicResponse: {
    type: String,
    required: true,
  },
  studyTips: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    enum: ["blue", "green", "yellow", "red", "orange"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("studyTopic", studyTopicSchema);
