const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data/index");

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
          expect(response.body).toEqual(require("../endpoints.json"));
        });
    });
  });