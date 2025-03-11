import express, { Express, Request, Response } from "express";
import cors from "cors";
import { router } from "./routers/router";
const app: Express = express();
app
    .use(cors())
    .use(express.json())
    .use("/", router)
    
app.listen(6801, () => {
    console.log("Server is listening on port 6801")
    console.log('aa')
})
