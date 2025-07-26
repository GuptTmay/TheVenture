import { Router } from "express";
import { auth } from "../middleware";
import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.use(auth);

userRouter.get("/blogs", UserController.getUserBlogs);

export default userRouter;
