import express, { Express, Request, Response } from "express";
import cors from "cors";
import { router } from "./routers/router";
import { handleApplicationErrors } from "./middleware";

const app: Express = express();
app
    .use(cors())
    .use(express.json())
    .use("/", router)
    .use(handleApplicationErrors);
app.listen(6801, () => {
    console.log("Server is listening on port 6801")
})
export default app