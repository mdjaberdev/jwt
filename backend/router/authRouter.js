const express = require("express");
const { registrationController, loginController } = require("../controllers/authController");
// const authMiddleware = require("../middlewares/authMiddleware");
// const registrationController = require("../controllers/registrationController");
// const loginController = require("../controllers/loginController");
// const privateDataController = require("../controllers/privateDataController");
const _ = express.Router();

// _.post("/registration", registrationController);
// _.post("/login", loginController);
// _.get("/privateData", authMiddleware, privateDataController);

_.post("/registration", registrationController)
_.post("/login", loginController);

module.exports = _;
