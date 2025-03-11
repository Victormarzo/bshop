import { Router } from "express";
import { controller } from "../controllers/controller";
import { repository } from "../repositories/repository";

export const router = Router();
router
    .get("/health", controller.getHealth)
    .post("/barber", controller.createBarber)
    .get("/barber", controller.getBarbers)
    .post("/service", controller.createService)
    .get("/service", controller.getServices)
    .get("/barber/:barberId", controller.getServicesByBarber)
    .get("/service/:serviceId", controller.getBarbersByService)
    .get("/schedule", controller.getFullSchedule)
    .post("/schedule", controller.createSchedule)
    .get("/user", controller.getUserByNumber)
    .post("/user", controller.createUser)
    .get("/test", repository.test)