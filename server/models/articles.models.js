const db = require("../../db/connection");

const selectArticleById = (id) => {
  const query =
    "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;";

  return db
    .query(query, [id])
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

const selectAllArticles = (order, sort_by, topic) => {
  let query =
    "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comments_count FROM articles LEFT OUTER JOIN comments ON articles.article_id=comments.article_id";

  let order_query = "";
  let sort_by_query = "";
  let topic_query = "";
  const group_by_query = " GROUP BY articles.article_id";

  if (sort_by) sort_by_query = ` ORDER BY articles.${sort_by}`;
  else sort_by_query = " ORDER BY articles.created_at";

  if (order === "asc") order_query = " ASC";
  else order_query = " DESC";

  if (topic) topic_query = ` WHERE topic='${topic}'`;

  query += topic_query + group_by_query + sort_by_query + order_query;
  return db
    .query(query)
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ msg: "No articles found.", status: 404 });
      return rows;
    })
    .catch((err) => {
      if (err.msg && err.status) return Promise.reject(err);
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
