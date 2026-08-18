const express = require("express");
const {
  registrationController,
  loginController,
  allDataController
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

_.post("/registration", createLimiter(20), registrationController);
_.post("/login", createLimiter(20), loginController);
_.get("/allDatas", createLimiter(20), allDataController);

module.exports = _;
