import { Router } from "express";
import BlogController from "../controllers/BlogController";

const blogRouter = Router();

blogRouter.get("/get", BlogController.getBlog);

export default blogRouter;