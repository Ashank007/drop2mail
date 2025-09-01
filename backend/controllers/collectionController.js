import Collection from "../models/Collection.js";

export const createCollection = async (req, res) => {
  try {
    const { title, description } = req.body;
    const collection = new Collection({
      title,
      description,
      createdBy: req.user.id,
    });
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ createdBy: req.user.id });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

