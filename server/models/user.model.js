const mongoose = require("mongoose");

const schema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  birthdate: { type: Date, default: Date.now },
  group: { type: String },
  course: { type: Number },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "student" },
});

module.exports = mongoose.model("User", schema);
