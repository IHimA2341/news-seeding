const db = require("../../db/connection");

const selectCommentsByArticleId = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;",
      [id]
    )
    .then((data) => {
      const { rows } = data;
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comments not found." });
      }
      return rows;
    })
    .catch((err) => {
      if (err.status && err.msg) return Promise.reject(err);
      return Promise.reject({ status: 400, msg: "Something went wrong." });
    });
};

module.exports = { selectCommentsByArticleId };
