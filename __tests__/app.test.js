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
          console.log(articles);
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
  });
});
