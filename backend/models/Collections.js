import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "creatorModel",
    required: true,
  },
  creatorModel: {
    type: String,
    required: true,
    enum: ["Admin", "Teacher"],
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  isAdminCollection: { type: Boolean, default: false },
}, { versionKey:false,timestamps: true });

const NewCollection = mongoose.model("Collection", collectionSchema);

export default NewCollection;

