const Reservation = require("../models/Reservation");
const Bus = require("../models/Bus");
const { broadcast } = require("../utils/websocket");

const createReservation = async (req, res) => {
  const { busId, tripId, seatNumber } = req.body;
  const commuter = req.user.id;

  try {
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const trip = bus.trips.find((t) => t._id.toString() === tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (seatNumber < 1 || seatNumber > bus.capacity) {
      return res
        .status(400)
        .json({ message: `Seat number must be between 1 and ${bus.capacity}` });
    }

    if (trip.bookedSeats.includes(seatNumber)) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    trip.bookedSeats.push(seatNumber);
    await bus.save();

    const newReservation = new Reservation({
      commuter,
      bus: busId,
      trip: trip._id,
      seatNumber,
    });
    await newReservation.save();

    broadcast({
      type: "seatReservationUpdate",
      busId,
      tripId,
      bookedSeats: trip.bookedSeats,
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create reservation",
      error: error.message,
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("commuter bus")
      .populate({
        path: "bus",
        populate: { path: "trips" },
      });
    res.status(200).json({ reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve reservations",
      error: error.message,
    });
  }
};

const getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id)
      .populate("commuter bus")
      .populate({
        path: "bus",
        populate: { path: "trips" },
      });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve reservation",
      error: error.message,
    });
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { seatNumber, paymentStatus } = req.body;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const bus = await Bus.findById(reservation.bus);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const trip = bus.trips.id(reservation.trip);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (seatNumber && seatNumber !== reservation.seatNumber) {
      if (trip.bookedSeats.includes(seatNumber)) {
        return res.status(400).json({ message: "New seat is already booked" });
      }

      trip.bookedSeats = trip.bookedSeats.filter(
        (seat) => seat !== reservation.seatNumber
      );
      trip.bookedSeats.push(seatNumber);
      await bus.save();
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { seatNumber: seatNumber || reservation.seatNumber, paymentStatus },
      { new: true }
    );

    broadcast({
      type: "seatReservationUpdate",
      busId: bus._id,
      tripId: trip._id,
      bookedSeats: trip.bookedSeats,
    });

    res.status(200).json({
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update reservation",
      error: error.message,
    });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;
  const commuterId = req.user.id;
  const userRole = req.user.role;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (
      userRole !== "admin" &&
      reservation.commuter.toString() !== commuterId
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reservations" });
    }

    const bus = await Bus.findById(reservation.bus);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const trip = bus.trips.id(reservation.trip);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.bookedSeats = trip.bookedSeats.filter(
      (seat) => seat !== reservation.seatNumber
    );
    await bus.save();

    await Reservation.findByIdAndDelete(id);

    broadcast({
      type: "seatReservationUpdate",
      busId: bus._id,
      tripId: trip._id,
      bookedSeats: trip.bookedSeats,
    });

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete reservation",
      error: error.message,
    });
  }
};

module.exports = {
  deleteReservation,
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};
