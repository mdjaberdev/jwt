require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const User = require("./models/userSchema");
const permission = require("./utils/permission");

app.post("/registration", async (req, res) => {
  let { email, role } = req.body;
  console.log(email, role);
  

  if (!role) {
    role = "student";
  }
  let per;
  permission.map((item) => {
    if (item.role == role) {
      per = item.permission;
    }
  });
  console.log(per);

  const user = await new User({
    email: email,
    role: role,
    permission: per
  }).save()

  res.send(user)
});

app.post("/login", async (req, res) =>{
  const {email} = req.body
  const existingUser = await User.findOne({email: email})
   console.log(existingUser);
   


})

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
