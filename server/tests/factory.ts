import pool from "../src/database"
import { NewUser } from "../src/protocols"


export async function createUser(params:NewUser) {
    return pool.query(`
        INSERT INTO users
        (name,number)
        VALUES($1,$2)
        RETURNING *    
    `,[params.name,params.number]
    )
}