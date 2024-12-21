const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  distance: { type: Number, required: true },
  estimatedTime: { type: String, required: true },
  fare: { type: Number, required: true },
});

module.exports = mongoose.model('Route', RouteSchema);
