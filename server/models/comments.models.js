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

const insertCommentsByArticleId = (id, body, username) => {
  return db
    .query(
      "INSERT INTO comments (article_id, body, votes, author) VALUES ($1, $2, 0, $3) RETURNING *",
      [id, body, username]
    )
    .then((data) => {
      const { rows } = data;
      console.log(rows);
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject({ status: 404, msg: "Something went wrong." });
    });
};

module.exports = { selectCommentsByArticleId, insertCommentsByArticleId };
