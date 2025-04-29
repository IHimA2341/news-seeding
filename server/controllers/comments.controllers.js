const {
  selectCommentsByArticleId,
  insertCommentsByArticleId,
} = require("../models/comments.models");

const getCommentsByArticleId = (req, res, next) => {
  return selectCommentsByArticleId(req.params.article_id)
    .then((rows) => {
      return res.status(200).send({ comments: rows });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (body === "") return next({ status: 400, msg: "No body included." });
  return insertCommentsByArticleId(article_id, body, username)
    .then((data) => {
      return res.status(201).send({ comment: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCommentsByArticleId, postCommentByArticleId };
