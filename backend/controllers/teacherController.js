import Teacher from "../models/Teacher.js";

export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hashedPassword });
    await teacher.save();
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, teacher: { id: teacher._id, name: teacher.name, email: teacher.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


