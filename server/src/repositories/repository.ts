import { error, time } from "console";
import pool from "../database";
import { NewBarber, NewUser, newScheduleWithEnd, Barber, NewService, NewBarberSession, Date, newSchedule } from "../protocols";

async function findBarberSession(token: string, barberId: number) {
    const response = await pool.query(
        `
        SELECT * FROM "barberSession" 
        WHERE token = $1
        AND "barberId" = $2
        ;
        `,
        [token, barberId]
    )
    return response.rows
}

async function getBarbers() {
    const response = await pool.query(
        "SELECT name,number,id FROM BARBERS;"
    )
    return response.rows
}

async function getBarberById(id: number) {
    const response = await pool.query(
        "SELECT name,number FROM BARBERS WHERE id = $1;", [id]
    )
    return response.rows
    // horario
}

async function createBarber(barber: NewBarber) {
    const response = await pool.query(
        `
        INSERT INTO BARBERS (name,password,number,email)
        VALUES ($1,$2,$3,$4);
        `
        , [barber.name, barber.password, barber.number, barber.email])

    return response.rowCount;
}
async function findBarberByEmail ( email:string){
    const response = await pool.query(
        `
        SELECT * FROM barbers 
        WHERE email = $1
        ;`,[email]
    )
    return response.rows
}
async function createService(service: NewService) {
    const response = await pool.query(
        `
        INSERT INTO SERVICES (name,duration,value)
        VALUES ($1,$2,$3)
        ;`
        , [service.name, service.duration, service.value]
    )
    return response;
}

async function getServices() {
    const response = await pool.query(
        // `SELECT s.duration,s.value,s.name as serviceName,b.id,b.name as barberName,s."barberId",b.number 
        // FROM SERVICES s 
        // JOIN BARBERS b ON s."barberId" = b.id;`)
        "SELECT * FROM SERVICES;")
    return response.rows;
}

async function getServiceById(serviceId: number) {
    const response = await pool.query(
        `
        SELECT * FROM services 
        WHERE services.id = $1
        ;`, [serviceId]
    )
    return response.rows;
}

async function getServicesByBarber(barberId: number) {
    const response = await pool.query(
        `SELECT s.name,s.value,s.duration, s.id 
        FROM "barberServices" bs
        JOIN services s on bs."serviceId"=s.id
        WHERE "barberId"=$1
        ;`,
        [barberId]
    )
    return response.rows;
}

async function getBarbersByService(serviceId: number) {
    const response = await pool.query(
        `SELECT b.id,b.name,b.number 
        FROM "barberServices" bs
        JOIN  BARBERS b on bs."barberId" = b.id
        WHERE bs."serviceId"=$1
        ;`,
        [serviceId]
    )
    return response.rows;
}

async function checkWorkingInterval(barberId: number) {
    const response = await pool.query(
        `SELECT "dayList"
        FROM "workingInterval" 
        WHERE "workingInterval"."barberId"=$1
        ;`,
        [barberId]
    )
    return response.rows[0];
}

async function getDayOff(barberId: number): Promise<Date[]> {
    const response = await pool.query(
        `SELECT date
        FROM "dayOff" 
        WHERE "dayOff"."barberId"=$1 
        ;`,
        [barberId]
    )
    return response.rows;
}

async function findBarberSessionByEmail(email: string) {
    const response = await pool.query(
        `SELECT * 
        FROM "barberSessions"
        WHERE email = $1
        ;`,
        [email]
    )
    return response.rows[0];
}

async function createBarberSession({ token, barberId }: NewBarberSession) {
    const response = await pool.query(
        `INSERT INTO "barberSessions"
        (token,"barberId")
        VALUES ($1,$2)
        ;`,
        [token, barberId]

    )
    //retornar token
    return response;
}

async function checkUserByNumber(number: string) {
    const response = await pool.query(
        `
            SELECT * FROM users
            WHERE number = $1
        ;`, [number]

    )
    return response.rows;
}

async function checkUserById(userId: number) {
    const response = await pool.query(
        `
            SELECT * FROM users
            WHERE id = $1
        ;`, [userId]

    )
    return response.rows;
}

async function createUser({ number, name }: NewUser) {
    const response = await pool.query(
        `
        INSERT INTO users
        (number,name)
        VALUES($1,$2)
        RETURNING *
        ;`, [number, name]
    )
    return response.rows;
}

async function checkDayVacancy(date: string, startTime: string, endTime: string) {
    const response = await pool.query(
        `
        SELECT * FROM schedules 
        WHERE date = $1
        ;`, [date]
    )
    return response.rows;
}

async function createSchedule(newSchedule: newScheduleWithEnd) {
    const response = await pool.query(
        `
        INSERT INTO schedules 
        ("barberId","userId","serviceId",date,time,"endTime")
        VALUES 
        ($1,$2,$3,$4,$5,$6)
        ;`, [newSchedule.barberId,
            newSchedule.userId,
            newSchedule.serviceId,
            newSchedule.date,
            newSchedule.time,
            newSchedule.endTime]
    )
    return response.rows;
}

async function updateStates(today:string,now:string){
    console.log('update')
    await pool.query(
        `
        UPDATE schedules
        SET status = 'FINALIZADO'
        WHERE date <= $1
        AND "endTime" <= $2
        AND status = 'AGENDADO'
        ;`,[today,now]
    )    
}

async function getScheduleList() {
    const response = await pool.query(
        `
        SELECT * FROM schedules
        WHERE status = 'AGENDADO'        
        ;`)
        return response.rows
}
async function test() {
    const test = await pool.query("SELECT * FROM schedules ")
    console.log(test.rows)
}
export const repository = {
    getBarbers,
    createBarber,
    createService,
    getBarberById,
    getServices,
    getServicesByBarber,
    getBarbersByService,
    checkWorkingInterval,
    getDayOff,
    findBarberSession,
    createBarberSession,
    findBarberSessionByEmail,
    findBarberByEmail,
    checkUserByNumber,
    checkUserById,
    createUser,
    getServiceById,
    checkDayVacancy,
    test,
    createSchedule,
    getScheduleList,
    updateStates
}