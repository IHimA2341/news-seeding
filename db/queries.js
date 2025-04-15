const db = require("./connection");

db.query("SELECT username FROM users;")
  .then(() => {
    return db.query("SELECT * FROM articles WHERE topic = 'coding'");
  })
  .then(() => {
    return db.query("SELECT * FROM comments WHERE votes < 0;");
  })
  .then(() => {
    return db.query("SELECT * FROM topics");
  })
  .then(() => {
    return db.query("SELECT * FROM articles WHERE author='grumpy19'");
  })
  .then(() => {
    return db.query("SELECT * FROM comments WHERE votes > 10");
  })
  .then((data) => {
    console.log(data.rows);
  });
