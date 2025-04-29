const { selectCommentsByArticleId } = require("../models/comments.models");

const getCommentsByArticleId = (req, res, next) => {
  return selectCommentsByArticleId(req.params.article_id)
    .then((rows) => {
      return res.status(200).send({ comments: rows });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCommentsByArticleId };
