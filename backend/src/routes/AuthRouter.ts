import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { validate } from "../middlewares/auth";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const authRouter = Router();

authRouter.post("/register",validate(registerSchema), AuthController.registerUser)
authRouter.post("/login",validate(loginSchema), AuthController.loginUser);

export default authRouter;