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
  const { order, sort_by, topic } = req.query;

  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return next({ status: 400, msg: "Input not valid." });
  }
  if (
    ![
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "article_img_url",
    ].includes(sort_by) &&
    sort_by !== undefined
  ) {
    return next({ status: 400, msg: "Input not valid." });
  }

  return selectAllArticles(order, sort_by, topic
  )
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
