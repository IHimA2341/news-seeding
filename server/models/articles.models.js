const db = require("../../db/connection");

const selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [id])
    .then((data) => {
      const { rows } = data;
      if (rows.length === 0) {
        console.log(0);
        return Promise.reject({ status: 404, msg: "ID not found." });
      }
      return rows[0];
    })
    .catch((err) => {
      if (err.status && err.msg) return Promise.reject(err);
      return Promise.reject({ status: 400, msg: "Something went wrong." });
    });
};

module.exports = { selectArticleById };
