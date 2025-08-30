import express from 'express'
import { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher } from '../controllers/teacherController.js'

const TeacherRouter = express.Router()

TeacherRouter.post('/create', createTeacher)
TeacherRouter.get('/getall', getTeachers)
TeacherRouter.get('/getteacher/:id', getTeacherById)
TeacherRouter.put('/update/:id', updateTeacher)
TeacherRouter.delete('/delete/:id', deleteTeacher)

export default TeacherRouter
