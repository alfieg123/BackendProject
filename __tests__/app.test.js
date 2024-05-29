const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data/index");
const endpoints = require("../endpoints.json")

beforeEach(() => {
    return seed(data);
  });
  
  afterAll(() => {
    return db.end();
  });

  describe("GET /api/topics", () => {
    test("Check topic for slug and description properties", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
              body.topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug");
                expect(topic).toHaveProperty("description");
              })
            });
          });
  });

  describe("GET /api", () => {
    test("Responds with an object describing all the available API endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.type).toEqual("application/json");
          expect(response.body).toEqual(endpoints);
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("Responds with an article object with appropriate properties", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toHaveProperty("author");
            expect(body.article).toHaveProperty("title");
            expect(body.article).toHaveProperty("article_id", 1);
            expect(body.article).toHaveProperty("body");
            expect(body.article).toHaveProperty("topic");
            expect(body.article).toHaveProperty("created_at");
            expect(body.article).toHaveProperty("votes");
            expect(body.article).toHaveProperty("article_img_url");
          })
        });
    test("Responds with a 404 error if article ID does not exist", () => {
      return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({ "msg" : "No article found for article_id: 999999" });
      });
    })
    test("Responds with a 400 error if article ID is invalid data", () => {
      return request(app)
      .get("/api/articles/ABC")
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({ "msg" : "Bad Request" });
      });
    })
    });
  
    describe("GET /api/articles", () => {
      test("Responds with an article object with appropriate properties", () => {
          return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(36);
            body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
              expect(article).not.toHaveProperty("body");
            })
            })
          });
        })