import NewCollection from "../models/Collections.js";
const capitalize = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createCollection = async (req, res) => {
  try {
    const { title, description, students, teachers } = req.body;
    const collection = new NewCollection({
      title,
      description,
      createdBy: req.user.id,
      creatorModel: capitalize(req.user.role),
      students: students || [],
      teachers: teachers || [],
    });
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyCollections = async (req, res) => {
  try {
    const collections = await NewCollection.find({
      createdBy: req.user.id,
      creatorModel: capitalize(req.user.role),
    })
      .populate("createdBy", "name email")
      .populate("students", "name email")
      .populate("teachers", "name email");

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const collection = await NewCollection.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id, creatorModel: capitalize(req.user.role) },
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
    const collection = await NewCollection.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
      creatorModel: capitalize(req.user.role),
    });

    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

