import { NextFunction, Request, Response } from "express";
import { prisma } from "..";

export const verifyAPIKey = async (req: Request, res: Response, next: NextFunction) => {
	const api_key = req.params.api_key
	
	const user = await prisma.user.findFirst({
		where: {
			apiKey: api_key
		}
	})

	if(!user) {
		res.status(400).send({
			error: "Can't find User",
			status: 400
		})
		return
	}

	res.locals.user = user
	
	next()
}
