require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
const express = require("express");
const cors = require("cors");
const dbconnection = require("./config/dbconnection");
const authRouter = require("./router/authRouter");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

// MAIN ROUTE
app.use("/api/v1/auth", authRouter);
// DBCONNECTION
dbconnection();

// SERVER PORT
app.listen(5000, () => {
  console.log("Server is Running 5000 port");
});
