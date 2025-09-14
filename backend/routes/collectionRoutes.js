import express from "express";
import {
  createCollection,
  getMyCollections,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import  auth  from "../middleware/auth.js";

const CollectionRouter = express.Router();

CollectionRouter.post("/", auth(["admin","teacher"]), createCollection);
CollectionRouter.get("/my", auth(["admin","teacher"]), getMyCollections);
CollectionRouter.put("/:id", auth(["admin","teacher"]), updateCollection);
CollectionRouter.delete("/:id", auth(["admin","teacher"]), deleteCollection);

export default CollectionRouter;

