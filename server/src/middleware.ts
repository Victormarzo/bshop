import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import { repository } from "./repositories/repository";
import {ApplicationError} from "./protocols";
const JWT_SECRET="top_secret"

/*export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return generateUnauthorizedResponse(res);
  const token = authHeader.split(" ")[1];
  if (!token) return generateUnauthorizedResponse(res);
  try {
    const {userId} = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const barberId = userId;
    const session  = await repository.findUSerSession(barberId, token)
    if (!session) return generateUnauthorizedResponse(res);
    req.userId = userId;
    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.sendStatus(httpStatus.UNAUTHORIZED);
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: number;
}*/

export function handleApplicationErrors(err: ApplicationError | Error, _req: Request, res: Response) {
  if ( err.name ) {
    console.error(err.name);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      error: "InternalServerError",
      message: "Internal Server Error",
    });
  }
}