const User = require("../models/user");

const updateOne = async (req, res) => {
  if (!req.userId) {
    return res.status(404).json({
      message: "Not authorized",
      success: false,
    });
  }
  try {
    await User.findByIdAndUpdate(req.param.id, req.body);
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

const getOne = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(404).json({
        message: "Not authorized",
        success: false,
      });
    }
    const item = await User.findById(req.userId);
    if (item) {
      return res.status(200).json({
        name: item.name,
        email: item.email,
        joined: item.createdAt,
        role: item.role,
      });
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

module.exports = {
  updateOne,
  getOne,
};
