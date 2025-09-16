import express from "express";
import { addstudent, getallstudents,updateStudent,deleteStudent } from "../controllers/studentController.js";
import auth from "../middleware/auth.js"
const StudentRouter = express.Router();

StudentRouter.post("/add", auth(["admin","teacher"]), addstudent);
StudentRouter.get("/all", auth(["admin","teacher"]), getallstudents);
StudentRouter.put("/:id", auth(["admin","teacher"]), updateStudent);
StudentRouter.delete("/:id", auth(["admin","teacher"]), deleteStudent);

export default StudentRouter;

