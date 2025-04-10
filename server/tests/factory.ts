import { faker } from "@faker-js/faker/.";
import pool from "../src/database"
import { NewBarber, NewUser } from "../src/protocols"
import bcrypt from "bcrypt";


export async function createUser(params:NewUser) {
    return pool.query(`
        INSERT INTO users
        (name,number)
        VALUES($1,$2)
        RETURNING *    
    `,[params.name,params.number]
    )
}

export async function createBarber(incomingEmail?:string) {
    const email = incomingEmail?(incomingEmail):(faker.internet.email())
    const incomingPassword = faker.internet.password({ length: 6 })
    const hashedPassword = await bcrypt.hash(incomingPassword, 10)
    const params = {
        name: faker.person.firstName(),
        number: `(21) 98999-99${faker.number.int(99)}`,
        password:hashedPassword,
        email,
        role:"CLIENT"
    }
    return pool.query(`
        INSERT INTO barbers 
        (email,name,number,password,role)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING name,number,id
        ;`,[params.email,params.name,params.number,params.password,params.role])
}