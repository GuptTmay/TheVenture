import { Request, Response } from "express";
import BlogModel from "../models/BlogModel";
import { getAiBlog, Status } from "../helper";
import VoteModel from "../models/VoteModel";
import CommentModel from "../models/CommentModel";

const blogModel = new BlogModel();
const voteModel = new VoteModel();
const commentModel = new CommentModel();

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

  static async getUserBlogs(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogs = await blogModel.getUserBlogs(userId);
      return res.status(200).json({ blogs: blogs });
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

  static async createAiBlog(req: Request, res: Response) {
    try {
      const topic = req.body.topic;
      const userId = req.user.id;
      const data: { title: string; content: string } | null = await getAiBlog(
        topic
      );

      if (!data) {
        return res.status(500).json({
          message: "Something went wrong! Try Again with different topic",
          status: Status.ERROR,
        });
      }
      // res.status(200).json({ title: data.title, content: data.content });
      const blogId = await blogModel.createBlog(
        data.title,
        data.content,
        userId
      );
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

  static async getBlogVotes(req: Request, res: Response) {
    try {
      const blogId = req.params["blogId"];
      const voteCount = await voteModel.countVotes(blogId);

      return res.status(200).json({ voteCount: voteCount });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async checkIfVoted(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogId = req.params["blogId"];

      const hasVoted = await voteModel.checkIfVoted(userId, blogId);
      return res.status(200).json({ hasVoted: hasVoted });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async addBlogVote(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogId = req.body.blogId;

      const hasVoted = await voteModel.checkIfVoted(userId, blogId);
      if (hasVoted)
        res
          .status(400)
          .json({ message: "Already Liked!", status: Status.INFO });
      await voteModel.addVote(userId, blogId);

      res.status(200).json({ message: "Blog Liked!", status: Status.INFO });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async removeBlogVote(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogId = req.body.blogId;
      await voteModel.removeVote(userId, blogId);

      const hasVoted = await voteModel.checkIfVoted(userId, blogId);
      if (hasVoted)
        return res
          .status(400)
          .json({ message: "Already Voted!", status: Status.INFO });

      res.status(200).json({ message: "Blog Unliked!", status: Status.INFO });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async getBlogComments(req: Request, res: Response) {
    try {
      const blogId = req.params["blogId"];
      const comments = await commentModel.getComments(blogId);
      res.status(200).json({ comments: comments });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }

  static async createBlogComment(req: Request, res: Response) {
    try {
      const blogId = req.params["blogId"];
      const userId = req.user.id;
      const content = req.body.content;

      const data = await blogModel.checkBlog(blogId);
      if (!data) {
        return res
          .status(404)
          .json({ message: "Blog Not Found!", status: Status.ERROR });
      }

      const comment = await commentModel.createComment(blogId, userId, content);
      res.status(201).json({
        comment: comment,
        message: "Comment Created!",
        status: Status.SUCCESS,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Something Went Wrong!", status: Status.ERROR });
    }
  }
}
