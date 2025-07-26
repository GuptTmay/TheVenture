import { Router } from "express";
import BlogController from "../controllers/BlogController";
import { auth, validate } from "../middleware";
import { createBlogSchema, updateBlogSchema } from "../schema";

const blogRouter = Router();

blogRouter.use(auth);

blogRouter.get("/", BlogController.getAllBlogs);
blogRouter.get("/blog/:blogId", BlogController.getBlog);
blogRouter.post("/blog", validate(createBlogSchema), BlogController.createBlog);
blogRouter.patch("/blog/:blogId", validate(updateBlogSchema), BlogController.updateBlog);
blogRouter.delete("/blog/:blogId", BlogController.deleteBlog);

export default blogRouter;
