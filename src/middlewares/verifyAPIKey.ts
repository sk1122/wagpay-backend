import { NextFunction, Request, Response } from "express";

export const verifyAPIKey = async (req: Request, res: Response, next: NextFunction) => {
	next()
}
