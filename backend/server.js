import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import TeacherRouter from "./routes/teacherRoutes.js";
import collectionRouter from "./routes/collectionRoutes.js";
dotenv.config();

const app = express();
ConnectDB();

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓 Drop2Mail backend is running" });
});

app.use("/api/v1/teacher", TeacherRouter);
app.use("/api/v1/collection",collectionRouter)

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running at http://localhost:${process.env.PORT}`);
});

