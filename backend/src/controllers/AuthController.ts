import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from 'bcrypt';
import { salt_rounds, JWT } from "../config";
import jwt from 'jsonwebtoken';


/*  
Auth functionallity Todo  
- Hash the password - Done
- Add JWT 
- Do zod validation
- verify the email at '/register' 
- Add OAuth in both '/register' and '/login' 
- Error Handling (weak password, already used email, missing credentials)
- Login user if they enter correct credentials at '/register'
*/

const userModel = new UserModel();

export default class AuthController {
  static async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = await userModel.checkUser(req.body.email);
      if (data !== null) {
        return res.status(409).json({ message: "Email already exists!!" });
      }

			const hashpass = await bcrypt.hash(req.body.password, salt_rounds); 

      let id = await userModel.createUser(req.body.email, hashpass);
      const token = jwt.sign({ id: id }, JWT.SECRET_KEY, { expiresIn: JWT.TOKEN_EXP });
 
      return res.status(201).json({token});
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

			const isMatch = await bcrypt.compare(req.body.password ,data.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invaild Passsword" });
      }

      const token = jwt.sign({id: data.id}, JWT.SECRET_KEY, { expiresIn: JWT.TOKEN_EXP });
      return res.status(200).json({token: token});
    } catch (error) {
      console.error("LogIn User Error: ", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}
