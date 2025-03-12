import { Request, Response } from "express";
import { repository } from "../repositories/repository";
import { Barber, ClientBarber, NewBarber } from "../protocols";
import httpStatus from "http-status";
import { service } from "../services/service";
import { request } from "http";
//import { AuthenticatedRequest } from "../middleware";

export function getHealth(req: Request, res: Response): void {
    console.log('Ta on')
}

export async function signBarberIn(req: Request, res: Response) {
    const { email, password } = req.body
    try {
        const session = await service.barberSignIn(email, password)
        return res.status(httpStatus.OK).send(session);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

/*export async function logOut(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        await service.logUserOut(userId);
        return res.sendStatus(httpStatus.OK)
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error)
    }
}*/

export async function createBarber(req: Request, res: Response) {
    console.log('createBarber')
    const barber = req.body
    try {
        const newBarber = await service.createBarber(barber);
        if (newBarber) {
            res.sendStatus(httpStatus.CREATED)
        }
    }
    catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
        //unauthorized
        //badrequest
    }
}

export async function getBarbers(req: Request, res: Response) {
    console.log('getBarber')
    try {
        const barberList = await service.getBarbers();
        res.status(httpStatus.OK).send(barberList)

    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function createService(req: Request, res: Response) {
    console.log('createService', req.body)
    const service = req.body
    try {
        const newService = await service.createService(service);
        if (newService) {
            res.sendStatus(httpStatus.CREATED)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
    }

}

export async function getServices(req: Request, res: Response) {
    console.log('getServices')
    try {
        const serviceList = await service.getServices();
        res.status(httpStatus.OK).send(serviceList)
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getServicesByBarber(req: Request, res: Response) {
    console.log('getServicesByBarber')
    const barberId = Number(req.params.barberId)
    try {
        const serviceList = await service.getServicesByBarber(barberId);
        res.status(httpStatus.OK).send(serviceList)
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getBarbersByService(req: Request, res: Response) {
    console.log('getBarberByService')
    const serviceId = Number(req.params.serviceId)
    try {
        const barberList = await service.getBarbersByService(serviceId);
        res.status(httpStatus.OK).send(barberList)
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getFullSchedule(req: Request, res: Response) {
    console.log('getSchedule');
    const serviceId = Number(req.body.serviceId);
    const barberId = Number(req.body.barberId);
    const date = req.body.date;
    const time = req.body.time;
    if (!serviceId || !barberId || !date || !time){
      res.sendStatus(httpStatus.NOT_FOUND)}
    try {
        const scheduleList = await service.getSchedule(barberId, date)
        res.status(httpStatus.OK).send(scheduleList)
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function createSchedule(req: Request, res: Response){
    console.log('createScheduless')
    const newScheduleBody = req.body 
    if (!newScheduleBody.barberId || !newScheduleBody.userId ||!newScheduleBody.time || !newScheduleBody.serviceId || !newScheduleBody.date){
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
    try {
        const newSchedule = await service.createSchedule(newScheduleBody)
        res.status(httpStatus.CREATED).send(newSchedule)
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST) 
    }
}

export async function getUserByNumber(req: Request, res: Response) {
    console.log('getUserByNumber')
    const userNumber = req.body
    try {
        const user = await service.getUserByNumber(userNumber)
        res.status(httpStatus.OK).send(user)
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST) 
    }
}

export async function createUser(req: Request, res: Response){
    console.log('createUser')
    const newUser = req.body;
    console.log(newUser)
    try {
        const user = await service.getUserByNumber(newUser.number)
        if(user.length !=0){
           res.sendStatus(httpStatus.BAD_REQUEST) 
        }
        const createUser = await service.createUser(newUser)
        res.status(httpStatus.CREATED).send(createUser);
    } catch (error) {
        console.log(error)
        res.sendStatus(httpStatus.BAD_REQUEST) 
    }
}


export const controller = {
    getHealth,
    createBarber,
    getBarbers,
    createService,
    getServices,
    getServicesByBarber,
    getBarbersByService,
    getFullSchedule,
    createSchedule,
    getUserByNumber,
    createUser
}