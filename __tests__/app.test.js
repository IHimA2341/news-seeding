const endpointsJson = require("../endpoints.json");
const app = require("../server/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("topics endpoint", () => {
  describe("GET /api/topics", () => {
    test("returns the correct information", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual([
            {
              description: "The man, the Mitch, the legend",
              slug: "mitch",
            },
            { description: "Not dogs", slug: "cats" },
            {
              description: "what books are made of",
              slug: "paper",
            },
          ]);
        });
    });
    test("returns 404 if given an invalid endpoint", () => {
      return request(app).get("/api/topic").expect(404);
    });
  });
});

describe("articles endpoint", () => {
  describe("GET /api/articles/:article_id", () => {
    test("should return the correct information", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toEqual(2);
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test("should return 400 if given an invalid input", () => {
      return request(app).get("/api/articles/aaaaaaaaaa").expect(400);
    });
    test("should return 404 if given an id out of range", () => {
      return request(app).get("/api/articles/100000").expect(404);
    });
  });

  describe("GET /api/articles", () => {
    test("should return the correct information object", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toEqual(13);
          expect(articles).toBeSorted("created_at", {
            descending: true,
          });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comments_count: expect.any(Number),
            });
          });
        });
    });

    describe("sorting queries", () => {
      describe("order", () => {
        test("should return the correct information for desc", () => {
          return request(app)
            .get("/api/articles?order=desc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted("created_at", {
                descending: true,
              });
            });
        });

        test("should return the correct information for desc", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted("created_at", {
                descending: false,
              });
            });
        });
      });

      describe("sort_by", () => {
        test("sort by article_id", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted("article_id", {
                descending: true,
              });
            });
        });

        test("sort by author", () => {
          return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted("author", {
                descending: true,
              });
            });
        });
      });

      describe("both queries", () => {
        test("sort by author ascending", () => {
          return request(app)
            .get("/api/articles?sort_by=author&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted("author", {
                descending: false,
              });
            });
        });
        test("sort by article_id", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSorted("article_id", {
                descending: false,
              });
            });
        });
      });

      describe("fail cases", () => {
        test("will throw an error if order is not asc or desc", () => {
          return request(app).get("/api/articles?order=aaaaaaaa").expect(400);
        });

        test("will throw an error if sort_by is not in the database as a column", () => {
          return request(app).get("/api/articles?sort_by=desc").expect(400);
        });
      });
    });

    describe("topic queries", () => {
      test("checks if it works with mitch", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toEqual(12);
            articles.forEach((article) => {
              expect(article.topic).toEqual('mitch');
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comments_count: expect.any(Number),
              });
            });
          });
      });

      test("checks if it works with cats", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            return request(app)
              .get("/api/articles?topic=cats")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toEqual(1);
                articles.forEach((article) => {
                  expect(article.topic).toEqual('cats');
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comments_count: expect.any(Number),
                  });
                });
              });
          });
      });

      test("returns 404 if topic does not exist", () => {
        return request(app)
          .get("/api/articles?topic=aaaaaaaaaaaaaaaaa")
          .expect(404);
      });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("should give the correct object", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toEqual(2);
          expect(comments).toBeSorted("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
        });
    });
    test("should return 404 if the ID does not exist.", () => {
      return request(app).get("/api/articles/10000/comments").expect(404);
    });
    test("should return 400 if the ID is not an integer", () => {
      return request(app)
        .get("/api/articles/aaaaaaaaaaaaaaaa/comments")
        .expect(400);
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("should return the correct value and status back", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "lurker", body: "cheese" })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            article_id: expect.any(Number),
          });
          expect(comment.body).toEqual("cheese");
          expect(comment.author).toEqual("lurker");
        });
    });

    test("should return a 404 if article_id does not exist", () => {
      return request(app)
        .post("/api/articles/1000000/comments")
        .send({ username: "lurker", body: "cheese" })
        .expect(404);
    });

    test("should return a 400 if body is empty", () => {
      return request(app)
        .post("/api/articles/1000000/comments")
        .send({ username: "lurker", body: "" })
        .expect(400);
    });

    test("should return a 404 if article_id is not an integer", () => {
      return request(app)
        .post("/api/articles/aaaaaaaaaaaaaa/comments")
        .send({ username: "lurker", body: "cheese" })
        .expect(404);
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("should return the correct status and update votes", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 100 })
        .expect(201)
        .then(() => {
          return request(app).get("/api/articles/2");
        })
        .then(({ body: { article } }) => {
          expect(article.votes).toEqual(100);
        });
    });

    test("should return 400 if the vote is not an integer", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "aaaaaaaaaa" })
        .expect(400);
    });

    test("should return 400 is the article_id is not an integer", () => {
      return request(app)
        .patch("/api/articles/aaaaaaaaaaa")
        .send({ inc_votes: "aaaaaaaaaa" })
        .expect(400);
    });

    test("should return 404 if the article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/10000000")
        .send({ inc_votes: 1000 })
        .expect(404);
    });
  });
});

describe("comments endpoint", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("should return the correct status", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });

    test("should return 404 if the id does not exist", () => {
      return request(app).delete("/api/comments/19999999").expect(404);
    });

    test("should return 400 if the id is not a number", () => {
      return request(app).delete("/api/comments/aaaaaaaa").expect(400);
    });
  });
});

describe("users endpoint", () => {
  describe("GET /api/users", () => {
    test("should return the correct information object", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toEqual(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});
