import express, { NextFunction, Request, Response, Router } from "express"
import PaymentIntentController from "./controllers/PaymentIntentController"

import verifyUser from "../../middlewares/verifyUser"
import { verifyAPIKey } from "../../middlewares/verifyAPIKey"
export const paymentIntentRouter = Router() 

const paymentIntentController = new PaymentIntentController()

export const apiKeyOrUser = (req: Request, res: Response, next: NextFunction) => {
	const list = Object.keys(req.headers)
	if(list.includes('bearer-token')) {
		return verifyUser(req, res, next)
	} else if (list.includes('api_key')) {
		return verifyAPIKey(req, res, next)
	} else {
		throw "Either add bearer-token or api_key"
	}
}

paymentIntentRouter.get("/", (req: Request, res: Response) => paymentIntentController.get(req, res))
paymentIntentRouter.post("/", [verifyAPIKey], (req: Request, res: Response) => paymentIntentController.post(req, res))
paymentIntentRouter.patch("/", [verifyUser], (req: Request, res: Response) => paymentIntentController.update(req, res))
paymentIntentRouter.delete("/", [verifyUser], (req: Request, res: Response) => paymentIntentController.delete(req, res))
