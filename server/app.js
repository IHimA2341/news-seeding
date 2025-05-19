const express = require("express");
const app = express();
const cors = require("cors");
const endpointsJson = require("../endpoints.json");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticleByArticleId,
} = require("./controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/comments.controllers");

const { getAllUsers } = require("./controllers/users.controllers");

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  return res.status(200).send({ endpoints: endpointsJson });
});
// topics endpoints
app.get("/api/topics", getAllTopics);

// articles endpoints
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleByArticleId);

// comments endpoints
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

// users endpoints
app.get("/api/users", getAllUsers);

app.get("/*splat", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    return res.status(err.status).send(err);
  }
});

module.exports = app;
