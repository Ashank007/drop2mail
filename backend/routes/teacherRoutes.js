import express from 'express'
import { loginTeacher, registerTeacher,getTeachers,updateTeacher,deleteTeacher } from '../controllers/teacherController.js'
import auth from "../middleware/auth.js"

const TeacherRouter = express.Router()

TeacherRouter.post('/register', registerTeacher)
TeacherRouter.post('/login', loginTeacher)


TeacherRouter.get("/", auth(["admin"]), getTeachers);
TeacherRouter.put("/:id", auth(["admin"]), updateTeacher);
TeacherRouter.delete("/:id", auth(["admin"]), deleteTeacher);

export default TeacherRouter
