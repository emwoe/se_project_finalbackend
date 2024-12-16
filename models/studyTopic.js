const mongoose = require("mongoose");

const validator = require("validator");

const studyTopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  summary: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400,
  },
  studytip: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400,
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

module.exports = mongoose.model("studyTopic", studyTopic);
