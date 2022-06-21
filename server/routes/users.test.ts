describe("API", () => {
    const request = require("supertest");
    const app = require("../../server/app");

    const email = "fakeuser@test.io"
    const password = "1234567890";

    it("Create user with empty fields", async () => {
        const response = await request(app).post("/api/users/create")
            .send({ });

        /*
            Response body should contain an error message
            Statuscode should be 403
        */

        expect(response.body).toEqual({"error":"Check required fields"});
        expect(response.statusCode).toBe(403);
    }); 

    it("Create user with password requirements not met", async () => {
        const response = await request(app).post("/api/users/create")
            .send({
                email: email,
                password: "1" // length 8 to 15 is required
            });

        /*
            Response body should contain an error message
            Statuscode should be 403
        */

        expect(response.body).toEqual({"error":"Check required fields"});
        expect(response.statusCode).toBe(403);
    }); 

    it("Create user", async () => {
        const response = await request(app).post("/api/users/create")
            .send({
                email: email,
                password: password
            });

        /*
            Response body should have "token" and "user_id"
            Statuscode should be 201
        */

        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("user_id");
        expect(response.statusCode).toBe(201);
    }); 

    it("Create duplicate user", async () => {
        const response = await request(app).post("/api/users/create")
            .send({
                email: email,
                password: password
            });

        /*
            Response body should have an error message
            Statuscode should be 409
        */

        expect(response.body).toEqual({ error: "User already exists" });
        expect(response.statusCode).toBe(409);
    }); 

  });