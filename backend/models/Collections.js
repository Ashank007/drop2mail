import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  isAdminCollection: { type: Boolean, default: false }, 
}, { timestamps: true });

export default mongoose.model("Collection", collectionSchema);

