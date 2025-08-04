import { Router } from "express";
import BlogController from "../controllers/BlogController";
import { auth, validate } from "../middleware";
import { createAiBlogSchema, createBlogSchema, updateBlogSchema } from "../schema";

const blogRouter = Router();

blogRouter.use(auth);

blogRouter.get("/", BlogController.getAllBlogs);
blogRouter.get("/blog/:blogId", BlogController.getBlog);
blogRouter.get("/user/blogs", BlogController.getUserBlogs);
blogRouter.post("/blog", validate(createBlogSchema), BlogController.createBlog);
blogRouter.patch("/blog/:blogId", validate(updateBlogSchema), BlogController.updateBlog);
blogRouter.delete("/blog/:blogId", BlogController.deleteBlog);
blogRouter.post("/blog/ai", validate(createAiBlogSchema), BlogController.createAiBlog);

blogRouter.get('/blog/:blogId/votes', BlogController.getBlogVotes);
blogRouter.get("/vote/:blogId", BlogController.checkIfVoted);
blogRouter.post("/vote", BlogController.addBlogVote);
blogRouter.delete("/vote", BlogController.removeBlogVote);

blogRouter.get('/blog/:blogId/comments', BlogController.getBlogComments);
blogRouter.post('/blog/:blogId/comments', BlogController.createBlogComment);

export default blogRouter;
