import { sendEmail } from "../utils/sendEmail.js";
import Student from "../models/Student.js";

const sendemail = async (req,res) => {
 try {
    const { studentIds, subject, message } = req.body;

    const students = await Student.find({ _id: { $in: studentIds } });
    const emails = students.map(s => s.email);

    if (emails.length === 0) return res.status(400).json({ error: "No emails found" });

    await sendEmail({
      to: emails,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    res.json({ success: true, sentTo: emails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {sendemail};
