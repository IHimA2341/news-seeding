const db = require("../../db/connection");

const selectAllUsers = () => {
  return db
    .query("SELECT * FROM users;")
    .then(({ rows }) => {
      return rows;
    })
    .catch(() => {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    });
};

module.exports = { selectAllUsers };
