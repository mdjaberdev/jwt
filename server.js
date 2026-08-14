require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(
    "mongodb+srv://mdjaber:jhjaber2004@cluster1.gxwb1gq.mongodb.net/todo?appName=Cluster1",
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(5000, () => {
  console.log("Server is Running 5000 port");
});
