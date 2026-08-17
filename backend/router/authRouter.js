const express = require("express");
const {
  registrationController
} = require("../controllers/authController");
const createLimiter = require("../utils/ralelimiter");
// const authMiddleware = require("../middlewares/authMiddleware");
// const registrationController = require("../controllers/registrationController");
// const loginController = require("../controllers/loginController");
// const privateDataController = require("../controllers/privateDataController");
const _ = express.Router();

// _.post("/registration", registrationController);
// _.post("/login", loginController);
// _.get("/privateData", authMiddleware, privateDataController);

_.post("/registration", createLimiter(2), registrationController);
// _.post("/login", createLimiter(2), loginController);

module.exports = _;
