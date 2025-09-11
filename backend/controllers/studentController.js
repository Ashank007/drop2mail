import Student from "../models/Student.js";
import  auth  from "../middleware/auth.js";

const addstudent = async(req,res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ error: "Access denied" });
    const { name, rollNo, email } = req.body;
    const student = new Student({ name, rollNo, email });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getallstudents = async(req,res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ error: "Access denied" });
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export{addstudent,getallstudents};
