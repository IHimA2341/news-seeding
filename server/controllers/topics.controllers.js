const { errorMonitor } = require("supertest/lib/test");
const { selectAllTopics } = require("../models/topics.models");

const getAllTopics = (req, res, next) => {
  return selectAllTopics()
    .then((data) => {
      res.status(200).send({ rows: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllTopics };
