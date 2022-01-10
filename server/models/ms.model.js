const { Schema, model } = require("mongoose");

const schema = new Schema({
  type: {
    type: Schema.Types.String,
    enum: ["a", "b", "c", "d"],
    required: true,
    default: "a",
  },
  amount: {
    type: Schema.Types.String,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
    default: Date.now,
  },
  approvalStatus: {
    type: Schema.Types.Boolean,
    required: true,
    default: true,
  },
  userId: {
    type: Schema.Types.String,
    required: true,
  },
});

module.exports = model("MaterialSupport", schema);
