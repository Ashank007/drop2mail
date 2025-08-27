import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

ConnectDB();

app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓 Drop2Mail backend is running" });
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running at http://localhost:${process.env.PORT}`);
});

