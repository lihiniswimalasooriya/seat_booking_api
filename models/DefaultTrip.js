const mongoose = require("mongoose");

const DefaultTripSchema = new mongoose.Schema({
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  startTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
});

module.exports = mongoose.model("DefaultTrip", DefaultTripSchema);
