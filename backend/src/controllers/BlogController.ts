import { Request, Response } from "express";
import BlogModel from "../models/BlogModel";
import { Status } from "../helper";

const blogModel = new BlogModel();

export default class BlogController {
  static async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogModel.getBlogs();
      return res.status(200).json({ blogs: blogs });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async getBlog(req: Request, res: Response) {
    try {
      const blogId = req.params["blogId"];
      const blogData = await blogModel.getBlog(blogId);
      return res.status(200).json({ blogData });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async createBlog(req: Request, res: Response) {
    try {
      const title = req.body.title;
      const content = req.body.content;
      const userId = req.user.id;

      const blogId = await blogModel.createBlog(title, content, userId);
      res.status(201).json({
        blogId: blogId,
        message: "Blog Created!",
        status: Status.SUCCESS,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async updateBlog(req: Request, res: Response) {
    try {
      const title = req.body.title;
      const content = req.body.content;
      const blogId = req.params.blogId;
      const userId = req.user.id;

      const toUpdateData: { title?: string; content?: string } = {};
      if (title) toUpdateData.title = title;
      if (content) toUpdateData.content = content;

      const data = await blogModel.updateBlog(blogId, userId, toUpdateData);
      if (!data) {
        return res
          .status(404)
          .json({ message: "Blog not found!", status: Status.ERROR });
      }

      return res
        .status(201)
        .json({ message: "Blog Updated", status: Status.SUCCESS });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async deleteBlog(req: Request, res: Response) {
    try {
      const blogId = req.params["blogId"];
      const userId = req.user.id;

      const data = await blogModel.getBlog(blogId);

      if (!data) {
        res
          .status(404)
          .json({ message: "Blog Not found!!", status: Status.ERROR });
      }

      await blogModel.deleteBlog(blogId, userId);

      res
        .status(200)
        .json({ message: "Blog Deleted!", status: Status.SUCCESS });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }
}
