const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  commuter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  tripId: { type: String, required: true },
  tripDate: { type: Date, required: true }, 
  startTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  seatNumber: { type: Number, required: true }, 
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
