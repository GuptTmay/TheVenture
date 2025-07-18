import { Request, Response } from 'express';

export default class BlogController {
  static async getBlog(req: Request, res: Response) {
      return res.status(200).json({message: `We Got the post!${process.env.REDIS_DB_USERNAME}`})
  } 
}

