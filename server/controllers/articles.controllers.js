const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.models");

const getArticleById = (req, res, next) => {
  return selectArticleById(req.params.article_id)
    .then((rows) => {
      return res.status(200).send({ article: rows });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllArticles = (req, res, next) => {
  return selectAllArticles()
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, getAllArticles };
