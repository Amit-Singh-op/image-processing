const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
});

module.exports = mongoose.model("Status", StatusSchema);
