import express, { NextFunction, Request, Response, Router } from "express";
import UserController from "./controller/UserController";

import verifyUser from "../../middlewares/verifyUser";
export const userRouter = Router();

const userController = new UserController();

userRouter.get("/", [verifyUser], (req: Request, res: Response) =>
  userController.get(req, res)
);

userRouter.get("/getuser/", (req: Request, res: Response, next: NextFunction) =>
  userController.getUserFrom(req, res, next)
);

userRouter.get("/:id", [verifyUser], (req: Request, res: Response) =>
  userController.getUser(req, res)
);
userRouter.post("/", (req: Request, res: Response) =>
  userController.post(req, res)
);
userRouter.patch("/", [verifyUser], (req: Request, res: Response) =>
  userController.update(req, res)
);
userRouter.delete("/", [verifyUser], (req: Request, res: Response) =>
  userController.delete(req, res)
);
