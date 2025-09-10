import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
  },
  { versionKey:false }
);


const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;

