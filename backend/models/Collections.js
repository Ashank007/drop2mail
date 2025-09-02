import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    required: true,
  },
  role: { type: String, enum: ["Teacher", "Admin"], required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  isAdminCollection: { type: Boolean, default: false }, 
}, { timestamps: true });

const NewCollection = mongoose.model("Collection", collectionSchema);

export default NewCollection;

