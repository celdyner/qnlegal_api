const Comment = require("../models/comment");
const Story = require("../models/story");

const addOne = async (req, res) => {
  try {
    const newRecord = new Comment({
      comment: req.body.comment,
      createdBy: req.userId,
    });
    await newRecord.save();

    const foundStory = await Story.findById(req.body.id);
    if (!foundStory) {
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    }
    foundStory.comment.push(newRecord._id);
    await foundStory.save();
    return res.status(201).json({
      message: "Item is successfully created",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const removeOne = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.param.id);
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
  try {
    await Comment.findByIdAndUpdate(req.param.id, req.body);
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

module.exports = {
  addOne,
  removeOne,
  updateOne,
};
