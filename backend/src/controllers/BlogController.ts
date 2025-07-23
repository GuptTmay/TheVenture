import { Request, Response } from 'express';
import { sendOtp } from '../helper';

export default class BlogController {
  static async getBlog(req: Request, res: Response) {
      return res.status(200).json({message: `We Got the post!`})
  } 

  static async sendEmail(req: Request, res: Response) {
    const email = req.query.email;
    if (typeof email !== 'string') return res.status(500).json({ message: 'Invalid email' });
    console.log(email);
    sendOtp(email);
    return res.status(200).json({message: `We Got the post! ${email}`})
  } 

}

