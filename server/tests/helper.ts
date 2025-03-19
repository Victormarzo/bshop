import pool from "../src/database";

export async function cleanDb() {
    await pool.query(`
        DELETE FROM schedules;
        `)
    await pool.query(`
        DELETE FROM users;
        `)
}