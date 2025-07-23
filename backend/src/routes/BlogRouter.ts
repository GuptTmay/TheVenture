import { Router } from "express";
import BlogController from "../controllers/BlogController";
import { auth } from "../middleware";

const blogRouter = Router();

// blogRouter.use(auth);
blogRouter.get("/get", BlogController.getBlog);
blogRouter.get("/sendemail", BlogController.sendEmail);

export default blogRouter;