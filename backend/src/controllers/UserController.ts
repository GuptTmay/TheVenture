import { Request, Response } from "express";
import BlogModel from "../models/BlogModel";
import { Status } from "../helper";

const blogModel = new BlogModel();

export default class UserController {
  static async getUserBlogs(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogs = await blogModel.getUserBlogs(userId);

      res.status(200).json({
        blogs: blogs,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }
}
