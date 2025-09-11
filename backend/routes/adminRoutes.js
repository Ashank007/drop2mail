import express from "express";
import { getStats, login, register } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const AdminRouter = express.Router();

AdminRouter.post("/register",register);
AdminRouter.post("/login",login);
AdminRouter.get("/stats",auth(["admin", "teacher"]),getStats);

export default AdminRouter;
