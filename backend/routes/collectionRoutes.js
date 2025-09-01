import express from "express";
import {
  createCollection,
  getMyCollections,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { auth } from "../middleware/auth.js";

const collectionRouter = express.Router();

collectionRouter.post("/", auth, createCollection);
collectionRouter.get("/my", auth, getMyCollections);
collectionRouter.put("/:id", auth, updateCollection);
collectionRouter.delete("/:id", auth, deleteCollection);

export default collectionRouter;

