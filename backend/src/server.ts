import express from "express";
import authRouter from "./routes/AuthRouter";
import { API_PREFIX, FRONTEND_URL } from "./config";
import blogRouter from "./routes/BlogRouter";
import cors from "cors";
import userRouter from "./routes/UserRouter";
import UserModel from "./models/UserModel";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/test", async (req, res) => {
  const userModel = new UserModel();
  const response = await userModel.checkUser("demo@gmail.com");
  res.json({
    "task": "keeping db and server alive.",
    "fetch_user_info": response  
  });
});

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);


app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/feeds`, blogRouter);
app.use(`${API_PREFIX}/user`, userRouter);

app.listen(port, () => {
  console.info(`Blogging app listening on port ${port}`);
});
