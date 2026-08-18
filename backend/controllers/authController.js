const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexPass =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const registrationController = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    if (!regexEmail.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!regexPass.test(password)) {
      return res.status(400).json({
        success: false,
        message: "8 to 16 chars, 1 uppercase, 1 lowercase, 1 number, 1 special",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm Password not match",
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      email: email,
      password: hashPassword,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const allDataController = async (req, res) => {
  const allDatas = await User.find({});

  res.status(200).json({
    success: false,
    message: allDatas,
  });
};

const loginController = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const existingUser = await User.findOne({ email: email });

    if (existingUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Otp not match",
      });
    }

    let matchPass = bcrypt.compareSync(password, existingUser.password);

    if (!matchPass) {
      return res.status(400).json({
        success: false,
        message: "Password not match",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Login",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const deleteController = async (req, res) => {
  const { id } = req.params;
  const deleteData = await User.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Deleted",
  });
};

const updateController = async (req, res) => {
  const { id } = req.params;

  const updateData = await User.findByIdAndUpdate({ _id: id }, req.body);
  res.status(200).json({
    success: true,
    message: "Updated",
  });
};

const sendotpControler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all  fields",
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let otp = otpGenerator.generate(6);
    await User.findOneAndUpdate({ email: email }, { otp: otp });

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "mdjaber.dev@gmail.com",
        pass: "glmn bseo dprq akxf",
      },
    });

    const info = await transporter.sendMail({
      from: '"Example Team" mdjaber.dev@gmail.com"',
      to: email, // list of recipients
      subject: "Hello", // subject line
      text: "Hello world?", // plain text body
      html: `<b>Hello ${otp}</b>`, // HTML body
    });

    return res.status(200).json({
      success: true,
      message: "Otp send",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

module.exports = {
  registrationController,
  allDataController,
  loginController,
  deleteController,
  updateController,
  sendotpControler,
};
