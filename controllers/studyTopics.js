const studyTopic = require("../models/studyTopic");
const {
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports.getTopics = (req, res) => {
  studyTopic
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createNewTopic = (req, res) => {
  const { topic, topicResponse, _id } = req.body;
  console.log("id coming through as");
  console.log(req.body._id);

  studyTopic
    .create({ topic: topic, topicResponse: topicResponse, owner: _id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.name });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

//  TO DO: add individual buttons to delete individual topics

module.exports.deleteTopic = (req, res, next) => {
  console.log(req.params.id);
  studyTopic
    .findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError("Item ID not found.");
    })
    .then((item) => {
      const ownerId = item.owner.toString();
      if (ownerId !== req.user._id) {
        throw new ForbiddenError("You are not the owner of this item.");
      }
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
