import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { validate } from "../middleware";
import { loginSchema, registerSchema } from "../schema";

const authRouter = Router();

authRouter.post("/register",validate(registerSchema), AuthController.registerUser)
authRouter.post("/login",validate(loginSchema), AuthController.loginUser);

export default authRouter;