const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");

const register = async (data, role, res) => {
  try {
    const userTaken = await validateEmail(data.email);
    if (userTaken) {
      return res.status(400).json({
        message: "Email is already taken",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(data.password, 16);

    const code = crypto.randomInt(100000, 1000000);

    const newUser = new User({
      ...data,
      password: hashedPassword,
      verificationCode: code,
      role: role, // Use the role parameter instead of data.status
    });
    await newUser.save();
    return res.status(201).json({
      message: "User Account created successfully",
      success: true,
    });
    //SEND VERIFICATION EMAIL TO USER
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const validateEmail = async (email) => {
  const user = await User.findOne({ email });
  return !!user; // Return true if user exists, false otherwise
};

module.exports = {
  register,
  validateEmail,
};
