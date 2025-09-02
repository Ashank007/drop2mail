import express from "express";
import { addstudent, getallstudents } from "../controllers/studentController.js";

const StudentRouter = express.Router();

StudentRouter.post("/add",addstudent);
StudentRouter.get("/all",getallstudents);

export default StudentRouter;

