export type Barber = {
    id: number,
    name:string,
    password:string,
    number:string,
    email:string,
    role:string
}

export type NewBarber = Omit <Barber, "id"|"role">;

export type ClientBarber = Omit <Barber, "password"|"email">;

export type User ={
    id:number,
    name:string,
    number:string
}

export type NewUser = Omit <User, "id">;

export type Service = {
    id: number,
    name:string,
    duration:number,
    value:number,
}


export type BarberSession = {
    id:number,
    token:string,
    barberId:number
}

export type NewBarberSession = Omit<BarberSession, "id">;

export type NewService = Omit<Service, "id">;

export type Date = {
    date:string
}

export type Schedule = {
    id: number,
    barberId:number,
    userId:number,
    status:string,
    serviceId:number,
    date:string,
    time:string,
    endTime:string
}

export type newSchedule = Omit <Schedule, "id" | "status" | "endTime" >
export type newScheduleWithEnd = Omit <Schedule, "id" | "status" >

export type ApplicationError = {
    name: string;
    message: string;
  };