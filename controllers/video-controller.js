const Video = require("../models/video");
// const paginate = require("express-paginate");
const Comment = require("../models/comment");

const addOne = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(404).json({
      message: "Not authorized",
      success: false,
    });
  }
  const { title, topic, videoUrl, videoName, trending } = req.body;
  const newRecord = new Video({
      title: title,
      topic: topic,
      videoUrl: videoUrl,
      videoName: videoName,
      createdBy: req.userId,
      trending: trending,
    });
  
    try {
      if (!newRecord.slug) {
        newRecord.slug = generateSlug(newRecord.title);
      }
      await newRecord.save();
      return res.status(201).json({
        message: "Item is successfully created",
        success: true,
      });
    }
    catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const removeOne = async (req, res) => {
  if (req.role !== "Administrator" && req.role !== "admin") {
    return res.status(404).json({
      message: "Not authorized",
      success: false,
    });
  }
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }
    return res.status(204).json({
      message: "Item successfully deleted",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const updateOne = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(404).json({
      message: "Not authorized",
      success: false,
    });
  }
  try {
    const { topic, title, trending } = req.body;
    const video = await Video.findById(req.params.id);
    if (video.createdBy !== req.userId && req.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }
    video.topic = topic;
    video.title = title;
    video.trending = trending;
    await video.save();
    return res.status(201).json({
      message: "Item successfully updated",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.status(201).json({
      data: videos,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getTopVideos = async (req, res) => {
  try {
    let result = await Video.find({})
      .populate("category", "title")
      .sort({ viewsCount: -1 })
      .limit(3)
      .lean()
      .exec();

    return res.status(201).json({
      data: results,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getOneBySlug = async (req, res) => {
  try {
    const item = await Video.findOneAndUpdate(
      { slug: req.params.slug }, // Use req.params.slug for finding by slug
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("category", "title");

    if (item) {
      item.comments = await Comment.find({ Video: item._id });
      return res.status(200).json(item);
    }

    return res.status(404).json({
      message: "Item not found",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const item = await Video.findById(req.params.id)
      .populate("category", "title");

    if (item) {
      item.comments = await Comment.find({ Video: item._id });
      return res.status(200).json(item);
    }

    return res.status(404).json({
      message: "Item not found",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const generateSlug = (title) => {
  const slugText = title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return slugText;
};


module.exports = {
  addOne,
  removeOne,
  updateOne,
  getAll,
  getTopVideos,
  getOneBySlug,
  getOne,
};
