const db = require("../../db/connection");

const selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [id])
    .then((data) => {
      const { rows } = data;
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found." });
      }
      return rows[0];
    })
    .catch((err) => {
      if (err.status && err.msg) return Promise.reject(err);
      return Promise.reject({ status: 400, msg: "Something went wrong." });
    });
};

const selectAllArticles = () => {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comments_count FROM articles LEFT OUTER JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then((data) => {
      const { rows } = data;
      return rows;
    })
    .catch(() => {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    });
};

const updateArticleByArticleId = (id, inc_votes) => {
  return selectArticleById(id)
    .then((data) => {
      const actual_votes =
        data.votes + inc_votes <= 0 ? 0 : inc_votes + data.votes;

      return db.query("UPDATE articles SET votes = $1 WHERE article_id=$2", [
        actual_votes,
        id,
      ]);
    })
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    })
    .catch((err) => {
      if (err) return Promise.reject(err);
      return Promise.reject({ status: 400, msg: "Something went wrong." });
    });
};

module.exports = {
  selectArticleById,
  selectAllArticles,
  updateArticleByArticleId,
};
