import express from "express";
import {
  createCollection,
  getMyCollections,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { auth } from "../middleware/auth.js";

const CollectionRouter = express.Router();

CollectionRouter.post("/", auth, createCollection);
CollectionRouter.get("/my", auth, getMyCollections);
CollectionRouter.put("/:id", auth, updateCollection);
CollectionRouter.delete("/:id", auth, deleteCollection);

export default CollectionRouter;

