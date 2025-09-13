import express from "express";
import { addstudent, getallstudents,updateStudent,deleteStudent } from "../controllers/studentController.js";
import auth from "../middleware/auth.js"
const StudentRouter = express.Router();

StudentRouter.post("/add", auth(["admin"]), addstudent);
StudentRouter.get("/all", auth(["admin"]), getallstudents);
StudentRouter.put("/:id", auth(["admin"]), updateStudent);
StudentRouter.delete("/:id", auth(["admin"]), deleteStudent);

export default StudentRouter;

