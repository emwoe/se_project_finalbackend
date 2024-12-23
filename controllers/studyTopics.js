const studyTopic = require("../models/studyTopic");

const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");

module.exports.getTopics = (req, res) => {
  studyTopic
    .find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createNewTopic = (req, res) => {
  const { topic, topicResponse, studyTips, _id, color } = req.body;

  studyTopic
    .create({
      topic: topic,
      topicResponse: topicResponse,
      studyTips: studyTips,
      owner: _id,
      color: color,
    })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Could not update with information provided.")
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteTopic = (req, res, next) => {
  console.log(req.params.id);
  studyTopic
    .findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError("Item ID not found.");
    })
    .then((item) => {
      const ownerId = item.owner.toString();
      return studyTopic
        .findByIdAndRemove(req.params.id)

        .then(() => res.send({ data: item }));
    })
    .catch((err) => {
      console.log("error type is:");
      console.log(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Something isn't formatted correctly."));
      } else if (err.statusCode === 404) {
        next(new NotFoundError("Item ID not found."));
      } else {
        next(err);
      }
    });
};
