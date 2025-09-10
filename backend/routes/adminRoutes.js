import express from "express";
import { login, register } from "../controllers/adminController.js";

const AdminRouter = express.Router();

AdminRouter.post("/register",register);
AdminRouter.post("/login",login);

export default AdminRouter;
