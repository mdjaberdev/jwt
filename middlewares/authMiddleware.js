const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    console.log(token.split(" ")[1]);

    jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET_ACCESS,
      function (err, decoded) {
        console.log(decoded);
        if (decoded.role == "student") {
          res.status(403).json("You don't have permission");
        } else {
          next();
        }
      },
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    });
  }
}

module.exports = authMiddleware;