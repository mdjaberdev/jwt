const User = require("../models/userSchema");
const permission = require("../utils/permission");

const registrationController = async (req, res) => {
  try {
    let { email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login instead.",
      });
    }
    if (!role) {
      role = "student";
    }

    let per;
    permission.map((item) => {
      if (item.role == role) {
        per = item.permission;
      }
    });

    const user = await new User({
      email: email,
      role: role,
      permission: per,
    }).save();

    res.status(201).json({
      success: true,
      user: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    });
  }
};

module.exports = registrationController;
