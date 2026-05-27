import Image from "../models/Image.js";

export const getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortMode = req.query.sort || "newest";
    const skip = (page - 1) * limit;

    if (sortMode === "popular") {
      const images = await Image.aggregate([
        { $addFields: { score: { $add: [{ $multiply: ["$likes", 3] }, "$clicks"] } } },
        { $sort: { score: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
      return res.json(images);
    }

    const images = await Image.find().sort({ _id: -1 }).skip(skip).limit(limit);
    res.json(images);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};