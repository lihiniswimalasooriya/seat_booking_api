const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  capacity: { type: Number, required: true },
});

module.exports = mongoose.model("Bus", BusSchema);
