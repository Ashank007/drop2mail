import express from 'express'
import { loginTeacher, registerTeacher } from '../controllers/teacherController.js'

const TeacherRouter = express.Router()

TeacherRouter.post('/register', registerTeacher)
TeacherRouter.post('/login', loginTeacher)

export default TeacherRouter
