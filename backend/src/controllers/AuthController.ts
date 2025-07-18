import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import { salt_rounds, JWT } from "../config";
import jwt from "jsonwebtoken";
import { sendOtp, setEmailVerified, verifyOtp } from "../helper";

/*  
Auth functionallity Todo  
- Hash the password - Done
- Add JWT - Done 
- Do zod validation - Done
- verify the email at '/register' 
- Add OAuth in both '/register' and '/login' 
- Error Handling (weak password, already used email, missing credentials) - Done ? 
- Login user if they enter correct credentials at '/register' - Done 
*/

const userModel = new UserModel();

export default class AuthController {
  static async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = await userModel.checkUser(req.body.email);
      if (data !== null) {
        const isMatch = await bcrypt.compare(req.body.password, data.password);
        if (isMatch) {
          const token = jwt.sign({ id: data.id }, JWT.SECRET_KEY, {
            expiresIn: JWT.TOKEN_EXP,
          });
          return res.status(200).json({ token: token });
        }

        return res.status(409).json({ message: "Email already exists!!" });
      }

      const hashpass = await bcrypt.hash(req.body.password, salt_rounds);

      let id = await userModel.createUser(req.body.email, hashpass);
      const token = jwt.sign({ id: id }, JWT.SECRET_KEY, {
        expiresIn: JWT.TOKEN_EXP,
      });

      return res.status(201).json({ token });
    } catch (error) {
      console.error("Register User Error: ", error);
      return res.status(500).json({ message: "Some thing went wrong" });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = await userModel.checkUser(req.body.email);
      if (data === null) {
        return res.status(409).json({ message: "User Not Registered!!" });
      }

      const isMatch = await bcrypt.compare(req.body.password, data.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invaild Passsword" });
      }

      const token = jwt.sign({ id: data.id }, JWT.SECRET_KEY, {
        expiresIn: JWT.TOKEN_EXP,
      });
      return res.status(200).json({ token: token });
    } catch (error) {
      console.error("LogIn User Error: ", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
  
  static async forgetPassword(req: Request, res: Response) {
   /// Send Otp to user email
   /// Verify the send otp    
    const otpToCheck = await sendOtp(req.body.email);
    const isMatch = verifyOtp(req.body.email, otpToCheck);

    if (!isMatch) {
      res.status(400).json({message: "Invaild/Expired OTP"});
    }
    
    setEmailVerified(req.body.email); 

    res.status(200).json({ success: true });
  } 

  static async changePassword(req: Request, res: Response) {
    const newPass: string = req.body.newPass;
    const otp = req.body.otp;

    const isMatch = verifyOtp(req.body.email, otp);

    if (!isMatch) {
      res.status(400).json({message: "Timeout"});
    }
    
    const hashPass = await bcrypt.hash(newPass, salt_rounds);

    await userModel.updateUser(req.body.email, {password: hashPass}); 
    res.status(201).json({message: "Success!"});
  }
}
