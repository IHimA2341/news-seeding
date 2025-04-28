const express = require("express");
const app = express();
const endpointsJson = require("../endpoints.json");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api", (req, res) => {
  return res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);

app.get("/*splat", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send(err);
  }
});

module.exports = app;
