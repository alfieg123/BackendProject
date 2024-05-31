const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data/index");
const endpoints = require("../endpoints.json");

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
            expect(body.article).toHaveProperty("comment_count");
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

        describe("GET /api/articles/:article_id/comments", () => {
          test("Responds with an array of comments with appropriate properties for given article ID", () => {
              return request(app)
              .get("/api/articles/6/comments")
              .expect(200)
              .then(({ body }) => {
                expect(Array.isArray(body.comments)).toBe(true);
                expect(body.comments.length).toBeGreaterThan(0);
                body.comments.forEach((comment) => {
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
                expect(comment).toHaveProperty("article_id", 6);
                })
              });
            })
          test("Responds with a 404 error if article ID does not exist", () => {
            return request(app)
            .get("/api/articles/999999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body).toMatchObject({ "msg" : "No article found for article_id: 999999" });
            });
          })
          test("Responds with a 400 error if article ID is invalid data", () => {
            return request(app)
            .get("/api/articles/ABC/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body).toMatchObject({ "msg" : "Bad Request" });
            });
          })
          });

  describe("POST /api/articles/:article_id/comments", () => {
    test("Responds with the posted comment with appropriate properties for given article ID", () => {
          const newComment = {
            username : "cooljmessy",
            body : "This is the body of a test comment"
          }
          return request(app)
          .post("/api/articles/8/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body).toHaveProperty("comment");
            expect(body.comment).toHaveProperty("article_id", 8);
            expect(body.comment).toHaveProperty("comment_id");
            expect(body.comment).toHaveProperty("body", newComment.body);
            expect(body.comment).toHaveProperty("author", newComment.username);
            })
          });
        test("Responds with a 404 error if article ID does not exist", () => {
          return request(app)
          .get("/api/articles/999999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body).toMatchObject({ "msg" : "No article found for article_id: 999999" });
          });
        })
        test("Responds with a 400 error if article ID is invalid data", () => {
          return request(app)
          .get("/api/articles/ABC/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ "msg" : "Bad Request" });
          });
        })
        test("Responds with a 404 error if username does not exist in database", () => {
          const newComment = {
            username : "nonExistentUsername",
            body : "This is the body of a test comment"
          }
          return request(app)
          .post("/api/articles/8/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "User nonExistentUsername not found" });
          })
        })
      })

  describe("PATCH /api/articles/:article_id", () => {
  test("Responds with an updated article with adjusted increased vote count", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes : 73 })
    .expect(200)
    .then(({ body }) => {
      expect(body.article).toHaveProperty("article_id", 1);
      expect(body.article).toHaveProperty("votes", 73);
    });
  });
  test("Responds with an updated article with adjusted decreased vote count", () => {
    return request(app)
    .patch("/api/articles/4")
    .send({ inc_votes : -24 })
    .expect(200)
    .then(({ body }) => {
      expect(body.article).toHaveProperty("article_id", 4);
      expect(body.article).toHaveProperty("votes", -24);
    });
  });
  test("Responds with a 400 error when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "Test" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Responds with a 204 status and no content and the comment is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });

  test("Responds with a 404 error when the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found for comment_id: 999999");
      });
  });

  test("Responds with a 400 error when comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("Responds with an array of user objects with appropriate properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("Additional GET /api/articles query tests", () => {
  test("Responds with an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=coding")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("coding");
        });
      });
  });
  test("Responds with an empty array if no articles match the topic", () => {
    return request(app)
      .get("/api/articles?topic=nonexistent_topic")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(0);
      });
  });
});


