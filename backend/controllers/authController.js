const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registrationController = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;

    if (!userName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    if (userName.length < 3 || userName.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Please must be between 3 and 20 character",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter right email",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password don't match",
      });
    }
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
    });

    await usersave();
    // res.status(201).json({
    //     success: true,
    //     message: "Registration successfully",
    //     user: {
    //  id: user._id
    //     }
    // });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = { registrationController };
