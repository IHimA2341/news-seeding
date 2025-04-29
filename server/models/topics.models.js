const { errorMonitor } = require("supertest/lib/test");
const db = require("../../db/connection");

const selectAllTopics = () => {
  return db
    .query("SELECT slug, description from topics;")
    .then((data) => {
      const { rows } = data;
      return rows;
    })
    .catch(() => {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    });
};

module.exports = { selectAllTopics };
