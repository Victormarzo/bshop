import pool from "../src/database";

export async function cleanDb() {
    await pool.query(`
        DELETE FROM schedules;
        `)
    await pool.query(`
        DELETE FROM users;
        `)
    await pool.query(`
        DELETE FROM "barberSessions";
        `)
    await pool.query(`
        DELETE FROM "barberServices";
        `)
    await pool.query(`
        DELETE FROM "workingInterval";
        `)
    await pool.query(`
        DELETE FROM "dayOff";
        `)
    await pool.query(`
        DELETE FROM barbers;
        `)
    await pool.query(`
        DELETE FROM services;
        `)
}