const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");

const register = async (data, role, res) => {
  try {
    const normalizedEmail = normalizeEmail(data.email); // Normalize email
    const userTaken = await validateEmail(normalizedEmail);

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
      email: normalizedEmail, // Save normalized email
      password: hashedPassword,
      verificationCode: code,
      role: data.status,
    });

    await newUser.save();
    return res.status(201).json({
      message: "User Account created successfully",
      success: true,
    });
    // SEND VERIFICATION EMAIL TO USER
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const login = async (data, res) => {
  try {
    let { email, password } = data;
    const normalizedEmail = normalizeEmail(email); // Normalize email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "Incorrect email",
        success: false,
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        token: token,
      });
    } else {
      return res.status(403).json({
        message: "Incorrect Password",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const verify = async (data, res) => {
  try {
    let { code } = data;
    const user = await User.findOne({ verificationCode: code });
    if (!user) {
      return res.status(404).json({
        message: "Invalid code",
        success: false,
      });
    } else if (user.isEmailVerified) {
      return res.status(404).json({
        message: "Email already verified",
        success: false,
      });
    }
    await user.update({ isEmailVerified: true });
    return res.status(201).json({
      message: "Email verification success",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const forgotPassword = async (data, res) => {
  try {
    let { email } = data;
    const normalizedEmail = normalizeEmail(email); // Normalize email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "Invalid email",
        success: false,
      });
    }

    const code = crypto.randomInt(100000, 1000000);
    const passwordResetCode = await bcrypt.hash(code.toString(), 16);
    await user.update({ passwordResetCode: passwordResetCode });

    // Send email with the verification code here

    return res.status(404).json({
      message: "Verification code sent to your email",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const resetPassword = async (data, res) => {
  try {
    let { email, code, newPassword } = data;
    const normalizedEmail = normalizeEmail(email); // Normalize email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "Invalid email",
        success: false,
      });
    }

    let isMatch = await bcrypt.compare(code.toString(), user.passwordResetCode);
    if (isMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 16);
      await user.update(
        { password: hashedPassword },
        { passwordResetCode: "" }
      );
      return res.status(201).json({
        message: "Your password has been successfully reset",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Invalid code",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const changePassword = async (data, res) => {
  try {
    let { oldPassword, newPassword } = data;
    const user = await User.findById(req.user._id);
    let isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 16);
      await user.update({ password: hashedPassword });

      return res.status(201).json({
        message: "Your password has been successfully reset",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Your old password is incorrect",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) {
    return true;
  } else {
    return false;
  }
};

// Helper function to normalize email
const normalizeEmail = (email) => {
  const [localPart, domain] = email.split('@');
  const normalizedLocalPart = localPart.replace(/\./g, ''); // Remove dots in the local part
  return `${normalizedLocalPart}@${domain.toLowerCase()}`;
};

module.exports = {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
  changePassword,
};
