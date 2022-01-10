const { Schema, model } = require("mongoose");

const schema = new Schema({
  fullName: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  birthdate: {
    type: Schema.Types.Date,
  },
  group: {
    type: Schema.Types.String,
  },
  course: {
    type: Schema.Types.Number,
  },
  isGroupLeader: {
    type: Schema.Types.Boolean,
    default: false,
  },
  passwordHash: {
    type: Schema.Types.String,
    required: true,
    select: false,
  },
  role: {
    type: Schema.Types.String,
    enum: ["admin", "manager", "student"],
    required: true,
    default: "student",
  },
});

module.exports = model("User", schema);
