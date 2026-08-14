const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const _ = express.Router();

_.post("/registration");
_.post("/login");
_.get("/privateData", authMiddleware);