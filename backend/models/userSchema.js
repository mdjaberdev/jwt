const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  // role: {
  //   type: String,
  //   enum: ["student", "teacher", "management"],
  //   default: "student"
  // },
  // permission: {
  //   type: Array,
  // },
});

module.exports = mongoose.model("User", userSchema);
