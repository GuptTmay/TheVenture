import express from "express";
import authRouter from "./routes/AuthRouter";
import { API_PREFIX, FRONTEND_URL } from "./config";
import blogRouter from "./routes/BlogRouter";
import cors from "cors";
import userRouter from "./routes/UserRouter";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);

app.get("/test", (req, res) => {
  res.send("Hell World!");
});

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/feed`, blogRouter);
app.use(`${API_PREFIX}/user`, userRouter);

app.listen(port, () => {
  console.info(`Blogging app listening on port ${port}`);
});
