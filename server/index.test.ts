const request = require("supertest");
const app = require("../server/index");

describe("API", () => {

    
    // routes which is not defined should return 404
    test("GET /route-should-not-exist", async () => {
        const response = await request(app).get("/route-should-not-exist");
        expect(response.body).toEqual({"error":"404 Not Found"});
        expect(response.statusCode).toBe(404);
    });

  });
  