import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
  recipients: [String],  
  subject: String,
  message: String,
  sentAt: { type: Date, default: Date.now },
});

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

export default EmailLog;

