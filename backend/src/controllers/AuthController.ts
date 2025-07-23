import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import { salt_rounds, JWT } from "../config";
import jwt from "jsonwebtoken";
import { sendOtp, Status } from "../helper";
import redisClient from "../redisClient";

/*  
Auth functionallity Todo  
  Done
- Hash the password - Done
- Add JWT - Done 
- Do zod validation - Done
- Error Handling (weak password, already used email, missing credentials) - Done  ? 
- Login user if they enter correct credentials at '/register' - Done 
- verify the email at '/register' Done


  Todo
- Add OAuth in both '/register' and '/login' 
- Handle Weak Passwords 
*/

/*
api end points todo -- Done All
POST /api/v1/auth/sendemail 
POST: auth/verifyotp?email=""&opt=""
POST: auth/changepass
*/

const userModel = new UserModel();

export default class AuthController {
  static async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = await userModel.checkUser(req.user.email);

      if (data) {
        const isMatch = await bcrypt.compare(req.body.password, data.password);

        if (isMatch) {
          const token = jwt.sign({ id: data.id }, JWT.SECRET_KEY, {
            expiresIn: JWT.TOKEN_EXP,
          });
          return res.status(200).json({
            token: token,
            message: "Authentication Successfull!!",
            status: Status.SUCCESS,
          });
        }

        return res
          .status(409)
          .json({ message: "Email already exists!!", status: Status.ERROR });
      }

      const hashpass = await bcrypt.hash(req.body.password, salt_rounds);

      let id = await userModel.createUser(
        req.body.name,
        req.user.email,
        hashpass
      );
      const token = jwt.sign({ id: id }, JWT.SECRET_KEY, {
        expiresIn: JWT.TOKEN_EXP,
      });

      return res.status(201).json({
        token,
        message: "Registeration Successfull!!",
        status: Status.SUCCESS,
      });
    } catch (error) {
      console.error("Register User Error: ", error);
      return res
        .status(500)
        .json({ message: "Some thing went wrong", status: Status.ERROR });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = await userModel.checkUser(req.body.email);
      if (!data) {
        return res
          .status(409)
          .json({ message: "User Not Registered!!", status: Status.ERROR });
      }

      const isMatch = await bcrypt.compare(req.body.password, data.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invaild Passsword", status: Status.ERROR });
      }

      const token = jwt.sign({ id: data.id }, JWT.SECRET_KEY, {
        expiresIn: JWT.TOKEN_EXP,
      });
      return res.status(200).json({
        token: token,
        message: "Authentication Successfull",
        status: Status.SUCCESS,
      });
    } catch (error) {
      console.error("LogIn User Error: ", error);
      return res
        .status(500)
        .json({ message: "Something went wrong", status: Status.ERROR });
    }
  }

  static async sendOtp(req: Request, res: Response) {
    const email = req.body.email;

    if (typeof email !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid email", status: Status.ERROR });
    }

    const otpKey = `otp:${email}`;
    const ttl = await redisClient.ttl(otpKey);

    if (ttl > 0) {
      return res.status(409).json({
        message: `Wait ${ttl} seconds for the OTP to expire`,
        status: Status.INFO,
      });
    }

    const otp = await sendOtp(email);
    await redisClient.set(otpKey, otp, { EX: 30 });

    return res.status(200).json({ message: "OTP Sent!", status: Status.INFO });
  }

  static async verifyOtp(req: Request, res: Response) {
    const otp = req.body.otp;
    const email = req.body.email;

    const otpKey = `otp:${email}`;
    const savedOtp = await redisClient.get(otpKey);

    if (!savedOtp) {
      return res
        .status(404)
        .json({ message: "OTP expired!", status: Status.ERROR });
    }

    if (savedOtp !== otp) {
      return res
        .status(401)
        .json({ message: "Invalid/Incorrect OTP", status: Status.ERROR });
    }

    const userData = await userModel.checkUser(email);

    if (!userData) {
      return res.status(404).json({
        message: "User Does't exist! Register Please",
        status: Status.ERROR,
      });
    }

    const token = jwt.sign({ email: userData.email }, JWT.SECRET_KEY, {
      expiresIn: 30,
    });

    return res
      .status(200)
      .json({ token: token, message: "User Verified", status: Status.SUCCESS });
  }

  static async changePassword(req: Request, res: Response) {
    const password = req.body.password;
    const email = req.user.email;

    try {
      const hashpass = await bcrypt.hash(req.body.password, salt_rounds);
      const userData = await userModel.updateUser(email, {
        password: hashpass,
      });

      return res
        .status(201)
        .json({ message: "Password Updated", status: Status.SUCCESS });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Some thing went wrong", status: Status.ERROR });
    }
  }
}
