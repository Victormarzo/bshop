import { repository } from "../repositories/repository";
import { Barber, ClientBarber, NewBarber, NewService, Service, Date, newSchedule, NewUser } from "../protocols";
import { error, time } from "console";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from "dayjs";;
import dayOfYear from "dayjs/plugin/dayOfYear";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { duplicatedNumberError, notFoundError } from "../errors";

const JWT_SECRET = "top_secret"

dayjs.extend(customParseFormat)
dayjs.extend(dayOfYear);

export async function createBarber(barber: NewBarber) {
    const create = await repository.createBarber(barber);
    return create;
}

export async function getBarbers(): Promise<ClientBarber[]> {
    const barberList = await repository.getBarbers()
    if (!barberList) throw error("nao tem lista de barbeiros");
    return barberList;
}

export async function createService(service: NewService) {
    const create = await repository.createService(service);
    return create;

}

export async function getServices(): Promise<Service[]> {
    const serviceList = await repository.getServices()
    if (!serviceList) throw error("nao tem lista de servicos")
    return serviceList;
}

export async function getServicesByBarber(barberId: number): Promise<Service[]> {
    const serviceList = await repository.getServicesByBarber(barberId)
    if (!serviceList) throw error("nao tem lista de servicos")
    return serviceList
}

export async function getBarbersByService(serviceId: number): Promise<Service[]> {
    const barberList = await repository.getBarbersByService(serviceId)
    if (!barberList) throw error("nao tem lista de barbeiros")
    return barberList
}

export async function getSchedule(barberId: number, date: string) {
    const dayOffList = await repository.getDayOff(barberId)
    updateStates()
    const dayList = await repository.checkWorkingInterval(barberId)
    const newDayOffList = getDayOffList(dayOffList)
    const week = getWeek(date, dayList.dayList, newDayOffList)
    const scheduleList = await repository.getScheduleList()
    return {scheduleList,week}
}

async function updateStates() {
    const today = dayjs().format("YYYY-MM-DD")
    const now = dayjs().format("HH:mm")
    await repository.updateStates(today,now)    
}
function getDayOffList(dayOffList: Date[]) {
    let newDayOffList = []
    for (let i = 0; i < dayOffList.length; i++) {
        newDayOffList.push(dayOffList[i].date)
    }
    return newDayOffList
}

function getWeek(date: string, dayList: string, dayOffList: string[]) {
    let workWeek = [];
    const startDay = dayjs(date, "DD-MM-YYYY")
    for (let i = 0; i < 10; i++) {
        let dayI = startDay.add(i, 'day')
        let dayDate = dayI.format("YYYY-MM-DD")
        let weekDay = dayI.day().toString()
        if (dayList.includes(weekDay) && !dayOffList.includes(dayDate)) {
            workWeek.push(dayDate)
        }
    }
    return workWeek

}

export async function getUserByNumber(number: string) {
    const user = await repository.checkUserByNumber(number)
    if(user.length ==0){
        throw notFoundError()
    }else{
        return user;
    }
    
}

async function checkUser(number:string){
    const user = await repository.checkUserByNumber(number)
    if(user.length ==0){
        return []
    }else{
        return user;
    }
}
export async function barberSignIn(email: string, password: string) {
    const barber = await repository.findBarberByEmail(email);
    if (!barber) throw error("erro de login");
    const barberId = barber.id
    const name = barber.name
    const correctPassword = await bcrypt.compare(password, barber.password);
    if (!correctPassword) throw error("erro de login");
    const token = jwt.sign({ barberId }, JWT_SECRET);
    await repository.createBarberSession({ token, barberId })

    return { barberId, token, name }
}

export async function createSchedule(newSchedule: newSchedule) {
    const {userId,barberId,date,serviceId,time}= newSchedule   
    const formatedDate = formatDate(date);
    const checkUser = await repository.checkUserById(userId)
    if (checkUser.length == 0) {
        throw error("usuario não cadastrado")
    }

    const service = await repository.getServiceById(serviceId)
    if (service.length == 0) {
        throw error("serviço não cadastrado")
    }

    const checkBarber = await repository.getBarberById(barberId)
    if (checkBarber.length == 0) {
        throw error("barbeiro não cadastrado")
    }

    const endTime = timeCalculator(newSchedule.time,service[0].duration)
    const daySchedule = await repository.checkDayVacancy(formatedDate,time,endTime)
    
    let vacancy
    if(daySchedule.length>0){
        const start = dayjs(time, "HH:mm")
        const end = dayjs(endTime, "HH:mm")
        for (let i=0; i< daySchedule.length; i++){
            const startC = dayjs(daySchedule[i].time, "HH:mm")
            const endC = dayjs(daySchedule[i].endTime, "HH:mm")
            if( start.diff(endC,"minute") < 0 && startC.diff(end, "minute") <0){
                vacancy=false
                break
            }
            console.log("SAI")
            vacancy = true
        }
    }else{
        vacancy = true
    }

    if(vacancy = false){
        throw error("horario nao esta livre")
    }
    const create = await repository.createSchedule({userId,barberId,date:formatedDate,serviceId,time,endTime})
    return create;
    
}

function formatDate(date:string){
    const formatedDate = dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD")
    console.log(formatedDate)
    return formatedDate
}
function timeCalculator(time: string, duration: number) {
    const endTime = dayjs(time, "HH:mm").add(duration, "minutes").format('HH:mm')
    return endTime
   /*  const freq = (Math.ceil(duration / 30))
    let timeArray =[time]
    for(let i=1; i<freq;i++){
        timeArray.push(
            dayjs(time, "HH:mm").add(30*i, "minutes").format('HH:mm')
        )
    }
    return timeArray */

    /* let hour = Number(endTime.split(":")[0])
    let minute =Number(endTime.split(":")[1])
    let nextFreeTime 
    if(minute>30){
        hour = hour+1
        hour.toString()
        nextFreeTime = hour+":00"
    }else{
        nextFreeTime = hour+":30"
    } */

    //console.log({nextFreeTime,endTime})

    //return x
}

export async function createUser(user: NewUser) {

    const newUser = await checkUser(user.number) 
    if(newUser.length !=0){
        throw duplicatedNumberError()
    }
    const create = await repository.createUser(user)
    if(create.length !=0){
        return create[0];
    }
    
}
export const service = {
    createBarber,
    getBarbers,
    createService,
    getServices,
    getServicesByBarber,
    getBarbersByService,
    getSchedule,
    barberSignIn,
    createSchedule,
    getUserByNumber,
    createUser
}