import express from "express";
import authRouter from "./routes/AuthRouter";
import { API_PREFIX } from "./config";
import blogRouter from "./routes/BlogRouter";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/test", (req, res) => {
  res.send("Hell World!");
});

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/blog`, blogRouter);

app.listen(port, () => {
  console.info(`Blogging app listening on port ${port}`);
});
