require("node:dns").setServers(["1.1.1.1"], ["8.8.8.8"]);
const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const User = require("./models/userSchema");
const permission = require("./utils/permission");
const jwt = require("jsonwebtoken");

app.post("/registration", async (req, res) => {
  try {
    let { email, role } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    if (!role) {
      role = "student";
    }

    let per;
    permission.map((item) => {
      if (item.role == role) {
        per = item.permission;
      }
    });

    const user = await new User({
      email: email,
      role: role,
      permission: per,
    }).save();

    res.status(201).json({
      success: true,
      user: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    });
  }
});

app.post("/login", async (req, res) => {
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
});

function abc(req, res, next) {
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

app.get("/privateData", abc, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Amr Facebook Idr Pass *******",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    });
  }
});

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
