const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "management"],
  },
  permission: {
    type: Array,
  },
});

module.exports = mongoose.model("User", userSchema);
