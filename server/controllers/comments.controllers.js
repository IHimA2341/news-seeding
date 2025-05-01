const db = require("../../db/connection");
const {
  selectCommentsByArticleId,
  insertCommentsByArticleId,
  deleteComment,
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

const deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;

  if (isNaN(Number(comment_id)))
    return next({ status: 400, msg: "ID is invalid." });

  return deleteComment(comment_id)
    .then(() => {
      return res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
};
