import supertest from "supertest";
import app from "../src/server";
import httpStatus from "http-status";
import pool from "../src/database";

import { faker } from "@faker-js/faker";
import { cleanDb } from "./helper";
import { createUser } from "./factory";

const api = supertest(app);

beforeEach(async () => {
    await cleanDb()
})

describe("POST /user", () => {
     it("should respond with status 400 when body is not given", async () => {
        const response = await api.post("/user");
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
        const response = await api.post("/user").send(invalidBody);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    }); 

    describe("when body is valid", () => {
        const generateValidBody = () => ({
            name: faker.person.firstName(),
            number: "(21) 98999-9999",
        });

         it("should respond with status 409 when there is an user with given phone number", async () => {
            const body = generateValidBody()
            await createUser(body)
            const newBody = generateValidBody()
            const response = await api.post("/user").send(newBody)
            expect(response.status).toBe(httpStatus.CONFLICT)
        }) 
        it("should respond with status 201 and create user when given number is unique", async () => {
            const body = generateValidBody()
            const response = await api.post("/user").send(body)
            const x = await pool.query("SELECT * FROM users;")
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual({
                id: expect.any(Number),
                name: body.name,
                number: body.number
            });
        })
         it("should save user on db", async () => {
            const body = generateValidBody()
            const userNumber = body.number
            await api.post("/user").send(body)
            const user = await api.get("/user").send({ userNumber })
            expect(user.body[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: body.name,
                    number: body.number
                })
            )
        }) 
    });
});

 describe("GET /user", () => {
    it("should respond with status 400 when body is not given", async () => {
        const response = await api.get("/user");
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
        const response = await api.get("/user").send(invalidBody);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
        const generateValidUser = () => ({
            name: faker.person.firstName(),
            number: "(21) 98999-9999",
        });
        const generateValidBody = ()=>({
            userNumber:"(21) 98999-9999"
        })

        it("should respond with status 404 when there is no user with given phone number", async () => {
            const user = generateValidUser();
            await createUser(user)
            const invalidUser = {userNumber:"(21) 98999-9499"}
            const response = await api.get("/user").send(invalidUser)
            expect(response.status).toBe(httpStatus.NOT_FOUND)
        })
        it("should respond with status 200 and the given user", async () => {
            const user = generateValidUser();
            await createUser(user)
            const body = generateValidBody()
            const response = await api.get("/user").send(body)
            expect(response.body[0]).toEqual({
                id: expect.any(Number),
                name: user.name,
                number: user.number
            });
        })
    });
}); 