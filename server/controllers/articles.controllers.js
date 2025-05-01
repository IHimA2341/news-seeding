const {
  selectArticleById,
  selectAllArticles,
  updateArticleByArticleId,
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

const patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;


  if (typeof inc_votes !== "number" || isNaN(Number(article_id))) {
    return next({
      status: 400,
      msg: "Invalid format.",
    });
  }
  return updateArticleByArticleId(article_id, inc_votes)
    .then((data) => {
      return res.status(201).send({ article: data });
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = { getArticleById, getAllArticles, patchArticleByArticleId };
