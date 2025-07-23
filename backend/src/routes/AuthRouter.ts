import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { auth, validate } from "../middleware";
import { changePasswordSchema, loginSchema, registerSchema, sendOtpSchema, verifyOtpSchema } from "../schema";


const authRouter = Router();

authRouter.post("/register", auth, validate(registerSchema), AuthController.registerUser)
authRouter.post("/login",validate(loginSchema), AuthController.loginUser);
authRouter.post("/sendotp", validate(sendOtpSchema), AuthController.sendOtp);
authRouter.post("/verifyotp", validate(verifyOtpSchema), AuthController.verifyOtp);
authRouter.post("/changepassword", auth, validate(changePasswordSchema), AuthController.changePassword);

export default authRouter;