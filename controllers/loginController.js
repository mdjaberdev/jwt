
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    res.status(404).json({
      success: false,
      message: "Please register and then login.",
    });
  }
  let accessToken = jwt.sign(
    {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: "1h" },
  );

  res.status(200).json({
    success: true,
    message: { accessToken },
  });
}

module.exports = loginController 