import { faker } from "@faker-js/faker/.";
import pool from "../src/database"
import { NewBarber, NewUser } from "../src/protocols"
import bcrypt from "bcrypt";


export async function createUser(params: NewUser) {
    return pool.query(`
        INSERT INTO users
        (name,number)
        VALUES($1,$2)
        RETURNING *    
    `, [params.name, params.number]
    )
}

export async function createBarber(incomingEmail?: string) {
    const email = incomingEmail ? (incomingEmail) : (faker.internet.email())
    const incomingPassword = faker.internet.password({ length: 6 })
    const hashedPassword = await bcrypt.hash(incomingPassword, 10)
    const params = {
        name: faker.person.firstName(),
        number: `(21) 98999-99${faker.number.int(99)}`,
        password: hashedPassword,
        email,
        role: "CLIENT"
    }
    return pool.query(`
        INSERT INTO barbers 
        (email,name,number,password,role)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING name,number,id
        ;`, [params.email, params.name, params.number, params.password, params.role])
}

export async function createService() {
    const params = {
        name: faker.person.jobTitle(),
        duration: faker.number.int(100),
        value: faker.number.int(10000),
    }
    return pool.query(`
        INSERT INTO services
        (duration,value,name)
        VALUES ($1,$2,$3)
        RETURNING *
        `, [params.duration,params.value,params.name])
}

export async function createBarberService(barberId:number,serviceId:number){
    const params = {
        barberId,
        serviceId
    }
    return pool.query(`
        INSERT INTO "barberServices"
        ("barberId","serviceId")
        VALUES ($1,$2)
        RETURNING *
        `,[params.barberId,params.serviceId])
}