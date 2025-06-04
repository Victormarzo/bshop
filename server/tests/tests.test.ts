import supertest from "supertest";
import app from "../src/server";
import httpStatus from "http-status";

import { faker } from "@faker-js/faker";
import { cleanDb } from "./helper";
import { createBarber, createBarberService, createService, createUser } from "./factory";
import { response } from "express";

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

describe("GET /barber",()=>{
   

    it("should respond with 404 and a empty list of barbers",async ()=>{
        const response = await api.get("/barber")
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    })
    it("should not return user password on body", async () => {
        const barber = await createBarber()
        const response = await api.get("/barber");
        expect(response.body).not.toHaveProperty("password");
    
    })   
    it("should respond with 200 and a list of barbers", async ()=>{
        const barber = await createBarber()
        const response = await api.get("/barber");
        const {name,number} = barber.rows[0]
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining([{
                id: expect.any(Number),
                name,
                number
            }])
        )
    })
})

describe("POST /barber", () => {
    it("should respond with status 400 when body is not given", async () => {
       const response = await api.post("/barber");
       expect(response.status).toBe(httpStatus.BAD_REQUEST);
   });

   it("should respond with status 400 when body is not valid", async () => {
       const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
       console.log("QAAAAAA",invalidBody)
       const response = await api.post("/barber").send(invalidBody);
       expect(response.status).toBe(httpStatus.BAD_REQUEST);
   }); 
   
   describe("when body is valid", () => { 
       const generateValidBody = () => ({
           name: faker.person.firstName(),
           number: "(21) 98999-9999",
           password: "validpassword",
           email:"fake@email.com"

       });
       
       it("should respond with status 409 when there is an barber with given email", async () => {
        const body = generateValidBody()
        await createBarber(body.email)
        
        const response = await api.post("/barber").send(body)
        expect(response.status).toBe(httpStatus.CONFLICT)
    }) 
       it("should respond with status 201 and create barber when given email is unique", async () => {
        const body = generateValidBody()
        const response = await api.post("/barber").send(body)
        expect(response.status).toBe(httpStatus.CREATED);
       
    })
    
    it("should save barber on db", async () => {
        const body = generateValidBody()
        await api.post("/barber").send(body)
        const user = await api.get("/barber")
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

describe("POST /service", () => {
    it("should respond with status 400 when body is not given", async () => {
       const response = await api.post("/service");
       expect(response.status).toBe(httpStatus.BAD_REQUEST);
   });

   it("should respond with status 400 when body is not valid", async () => {
       const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
       const response = await api.post("/service").send(invalidBody);

       expect(response.status).toBe(httpStatus.BAD_REQUEST);
   }); 

   describe("when body is valid", () => { 
       const generateValidBody = () => ({
           name: faker.person.jobTitle(),
           duration: faker.number.int(100),
           value: faker.number.int(10000),
       });
       
       it("should respond with status 201 and create service", async () => {
        const body = generateValidBody()
        const response = await api.post("/service").send(body)
        expect(response.status).toBe(httpStatus.CREATED);
       
    })
    
    it("should save service on db", async () => {
        const body = generateValidBody()
        await api.post("/service").send(body)
        const service = await api.get("/service")
        expect(service.body[0]).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: body.name,
                duration: body.duration,
                value:body.value
            })
        )
    })
    
   });
});

describe("GET /barber/:barberId",()=>{
    
    it("should respond with 404 if the barber does not exist", async()=>{
        const barber = await createBarber()
        const service = await createService()
        await createBarberService(barber.rows[0].id,service.rows[0].id)
        const response = await api.get(`/barber/${barber.rows[0].id*2}`)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    })
    it("should respond with 404 and a empty list of services when the given barber does not have one",async ()=>{
      const barber = await createBarber()
      await createService()
      const response = await api.get(`/barber/${barber.rows[0].id}`)
      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })
 
    it("should respond with 200 and a list of services", async ()=>{
        const barber = await createBarber()
        const service = await createService()
        const service2 = await createService()
        await createBarberService(barber.rows[0].id,service.rows[0].id)
        await createBarberService(barber.rows[0].id,service2.rows[0].id)

        const response = await api.get(`/barber/${barber.rows[0].id}`)
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining([{
                id: expect.any(Number),
                name:service.rows[0].name,
                value:service.rows[0].value,
                duration:service.rows[0].duration
            },{
                id: expect.any(Number),
                name:service2.rows[0].name,
                value:service2.rows[0].value,
                duration:service2.rows[0].duration
            }])
        )
    })
})

describe("GET /service/:serviceId",()=>{
    
    it("should respond with 404 if the service does not exist", async()=>{
        const barber = await createBarber()
        const service = await createService()
        await createBarberService(barber.rows[0].id,service.rows[0].id)
        const response = await api.get(`/service/${service.rows[0].id*2}`)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    })
    it("should respond with 404 and a empty list of barbers when there are no barbers that perform the chosen service",async ()=>{
      await createBarber()
      const service = await createService()
      const response = await api.get(`/barber/${service.rows[0].id}`)
      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })
 
    it("should respond with 200 and a list of barbers", async ()=>{
        const barber = await createBarber()
        const barber2 = await createBarber()
        const service = await createService()
        await createBarberService(barber.rows[0].id,service.rows[0].id)
        await createBarberService(barber2.rows[0].id,service.rows[0].id)

        const response = await api.get(`/service/${service.rows[0].id}`)
        console.log(response.body)
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining([{
                id: expect.any(Number),
                name:barber.rows[0].name,
                number:barber.rows[0].number,
            },{
                id: expect.any(Number),
                name:barber2.rows[0].name,
                number:barber2.rows[0].number,
            }])
        )
    })
})