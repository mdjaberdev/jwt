const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registrationController = (req, res) => {
 try{
     const { userName, email, password, confirmPassword } = req.body;

  if (!userName || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter right email",
    });
  }

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  if (password == !confirmPassword) {
     return res.status(400).json({
       success: false,
       message:
         "Password don't match",
     });
  }
 }catch (error){
    res.status(500).json({
        success: false
    })
 }
};

module.exports = { registrationController };
