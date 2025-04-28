const { selectArticleById } = require("../models/articles.models");

const getArticleById = (req, res, next) => {
  return selectArticleById(req.params.article_id)
    .then((rows) => {
      return res.status(200).send({ article: rows });
    })
    .catch((err) => {
      console.log(err.status);
      return next(err);
    });
};

module.exports = { getArticleById };
