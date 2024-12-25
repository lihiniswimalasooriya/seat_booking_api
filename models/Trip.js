const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  defaultTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DefaultTrip",
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  bookedSeats: { type: [Number], default: [] },
});

module.exports = mongoose.model("Trip", TripSchema);
