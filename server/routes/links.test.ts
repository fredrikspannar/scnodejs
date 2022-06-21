
describe("API", () => {
    const request = require("supertest");
    const app = require("../../server/app");

    const testlink = "https://aftonbladet.se";
    const email = "fakelinks@test.io"
    const password = "1234567890";


    it("Create a new link with no token", async() =>{
        const response = await request(app).post("/api/links/create")
            .send({ link: testlink});

        /*
            Response body should contain an error message
            Statuscode should be 403
        */

        expect(response.body).toEqual({"error":"A token is required"});
        expect(response.statusCode).toBe(403);
    });

    it("Create a new link with empty fields", async() =>{
        // setup new testuser
        const userResponse = await request(app).post("/api/users/create").send({email: email, password: password });

        let userToken = userResponse.body.token;

        // then continue with test
        const response = await request(app).post("/api/links/create")
            .set({ Authorization: userToken })
            .send({ });

        /*
            Response body should contain an error message
            Statuscode should be 403
        */

        expect(response.body).toEqual({"error":"Check required fields"});
        expect(response.statusCode).toBe(403);
    }); 

});