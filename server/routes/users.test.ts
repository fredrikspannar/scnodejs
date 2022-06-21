const request = require("supertest");
const app = require("../../server/index");

describe("API", () => {

    // routes which is not defined should return 404
    test("POST /api/users", async () => {
        const response = await request(app).post("/api/users")
            .send({
                /* empty post data should fail validation*/
            });

        expect(response.body).toEqual({"error":"Check required fields"});
        expect(response.statusCode).toBe(403);
    }); 

  });