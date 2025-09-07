import express from "express";
import { sendemail } from "../controllers/emailController.js";

const EmailRouter = express.Router();

EmailRouter.post("/send",sendemail);

export default EmailRouter;
