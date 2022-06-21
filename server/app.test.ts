
describe("API", () => {
    const request = require("supertest");
    const app = require("./app");

    // routes which is not defined should return 404
    it("Routes not defined", async () => {
        const response = await request(app).get("/route-should-not-exist");
        expect(response.body).toEqual({"error":"404 Not Found"});
        expect(response.statusCode).toBe(404);
    });

});
