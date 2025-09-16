import Student from "../models/Student.js";

const addstudent = async(req,res) => {
  try {
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
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNo, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, rollNo, email },
      { new: true }
    );

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export{addstudent,getallstudents,updateStudent,deleteStudent};
