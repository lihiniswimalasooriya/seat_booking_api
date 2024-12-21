const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  capacity: { type: Number, required: true },
  trips: [
    {
      tripId: { type: String, required: true, unique: true },
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      arrivalTime: { type: String, required: true },
      bookedSeats: { type: [Number], default: [] },
    },
  ],
});

module.exports = mongoose.model('Bus', BusSchema);
