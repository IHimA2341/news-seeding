const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS topics CASCADE;")
    .then(() => {
      return db.query(
        "CREATE TABLE topics (slug VARCHAR(100) PRIMARY KEY, description VARCHAR(500), img_url VARCHAR(1000));"
      );
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users CASCADE;");
    })
    .then(() => {
      return db.query(
        "CREATE TABLE users (username VARCHAR(50) PRIMARY KEY, name VARCHAR(50), avatar_url VARCHAR(1000));"
      );
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles CASCADE;");
    })
    .then(() => {
      return db.query(
        "CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(100), " +
          "topic VARCHAR(100) REFERENCES topics (slug) ON DELETE CASCADE, author VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE, " +
          "body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000));"
      );
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS comments;");
    })
    .then(() => {
      return db.query(
        "CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles (article_id), body TEXT, " +
          "votes INT DEFAULT 0, author VARCHAR(50) REFERENCES users (username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
      );
    })
    .then(() => {
      const topicsToInsert = format(
        "INSERT INTO topics (slug, description, img_url)VALUES %L",
        topicData.map((topics) => {
          return [topics.slug, topics.description, topics.url];
        })
      );
      return db.query(topicsToInsert);
    })
    .then(() => {
      const usersToInsert = format(
        "INSERT INTO users (username, name, avatar_url) VALUES %L",
        userData.map((users) => {
          return [users.username, users.name, users.avatar_url];
        })
      );
      return db.query(usersToInsert);
    })
    .then(() => {
      const articlesToInsert = format(
        "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *",
        articleData.map((article) => {
          article = convertTimestampToDate(article);
          return [
            article.title,
            article.topic,
            article.author,
            article.body,
            article.created_at,
            article.votes,
            article.article_img_url,
          ];
        })
      );
      return db.query(articlesToInsert);
    })
    .then((data) => {
      commentData.forEach((comment) => {
        article_wanted = data.rows.find((article) => {
          if (article.title == comment.article_title) return article;
        });
        comment.article_id = article_wanted.article_id;
      });
      const commentsToInsert = format(
        "INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L",
        commentData.map((comment) => {
          comment = convertTimestampToDate(comment);
          return [
            comment.article_id,
            comment.body,
            comment.votes,
            comment.author,
            comment.created_at,
          ];
        })
      );
      return db.query(commentsToInsert);
    })
    .then(() => {
      console.log("Setup complete!");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = seed;
