const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let lowercasePattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// registrationController
const registrationController = async (req, res) => {
  const { userName, email, password } = req.body;

  // empty fields validation
  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  // userName validation
  if (userName.length < 3 || userName.length > 20) {
    return res.status(400).json({
      success: false,
      message: "userName must be in between 3 to 20 character",
    });
  }
  console.log(userName);

  // existing user
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }
  // email validation
  if (!pattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }
  console.log(email);

  // password validation
  if (!lowercasePattern.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Please must contain a lowercase uppoercase number special character and minumum 8 character",
    });
  }
  console.log(password);
  // password hashing
  const hash = bcrypt.hashSync(password, 10);

  // schema validation
  const user = new User({
    userName: userName,
    email: email,
    password: hash,
  });
  // save to database
  await user.save();

  return res.status(201).json({
    success: true,
    message: "Registration successful",
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).json({
      seccess: false,
      message: "User not exists",
    });
  }
  let pass = bcrypt.compareSync(password, existingUser.password);

  if (!pass) {
    return res.status(400).json({
      seccess: false,
      message: "Password not match",
    });
  }

  let accessToken = jwt.sign(
    {
      id: existingUser._id,
      userName: existingUser.userName,
      email: existingUser.email,
      password: existingUser.password,
    },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: "1h" },
  );

  res.status(201).json({
    success: true,
    message: "Login successful",
    token: accessToken,
  });
};

module.exports = { registrationController, loginController };
