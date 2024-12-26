const Reservation = require("../models/Reservation");
const Bus = require("../models/Bus");
const Trip = require("../models/Trip");
const DefaultTrip = require("../models/DefaultTrip");
const Route = require("../models/Route");
const { broadcast } = require("../utils/websocket");

const createReservation = async (req, res) => {
  const { busId, defaultTripId, date, seatNumber } = req.body;
  const commuter = req.user.id;

  try {
    if (!busId || !defaultTripId || !date || !seatNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const defaultTrip = await DefaultTrip.findById(defaultTripId);
    if (!defaultTrip) {
      return res.status(404).json({ message: "Default trip not found" });
    }

    const route = await Route.findById(defaultTrip.route);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (seatNumber < 1 || seatNumber > bus.capacity) {
      return res
        .status(400)
        .json({ message: `Seat number must be between 1 and ${bus.capacity}` });
    }

    let trip = await Trip.findOne({ date, busId, defaultTripId });
    if (trip) {
      if (trip.bookedSeats.includes(seatNumber)) {
        return res.status(400).json({ message: "Seat already booked" });
      }

      trip.bookedSeats.push(seatNumber);
      await trip.save();
    } else {
      trip = new Trip({
        date,
        busId,
        defaultTripId,
        routeId: route._id,
        bookedSeats: [seatNumber],
      });
      await trip.save();
    }

    const newReservation = new Reservation({
      commuter,
      bus: busId,
      trip: trip._id,
      seatNumber,
      paymentStatus: "pending",
    });
    await newReservation.save();

    broadcast({
      type: "seatReservationUpdate",
      busId,
      tripId: trip._id,
      bookedSeats: trip.bookedSeats,
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({
      message: "Failed to create reservation",
      error: error.message,
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("commuter bus trip");

    if (!reservations.length) {
      return res.status(404).json({ message: "No reservations found" });
    }

    res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    res.status(500).json({
      message: "Failed to retrieve reservations",
      error: error.message,
    });
  }
};

const getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    const reservation = await Reservation.findById(id)
      .populate("commuter bus trip");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ reservation });
  } catch (error) {
    console.error("Error retrieving reservation:", error);
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
    if (!id) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const bus = await Bus.findById(reservation.bus);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const trip = await Trip.findById(reservation.trip);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (seatNumber && seatNumber !== reservation.seatNumber) {
      if (trip.bookedSeats.includes(seatNumber)) {
        return res.status(400).json({ message: "New seat is already booked" });
      }

      trip.bookedSeats = trip.bookedSeats.filter(
        (seat) => seat !== reservation.seatNumber
      );
      trip.bookedSeats.push(seatNumber);
      await trip.save();
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
    console.error("Error updating reservation:", error);
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
    if (!id) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

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

    const trip = await Trip.findById(reservation.trip);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.bookedSeats = trip.bookedSeats.filter(
      (seat) => seat !== reservation.seatNumber
    );
    await trip.save();

    await Reservation.findByIdAndDelete(id);

    broadcast({
      type: "seatReservationUpdate",
      busId: bus._id,
      tripId: trip._id,
      bookedSeats: trip.bookedSeats,
    });

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({
      message: "Failed to delete reservation",
      error: error.message,
    });
  }
};

const getOrCreateTripByDetails = async (req, res) => {
  const { busId, defaultTripId, date, routeId } = req.query;

  try {
    if (!busId || !defaultTripId || !date | !routeId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let trip = await Trip.findOne({ busId, defaultTripId, date });

    if (!trip) {
      const defaultTrip = await DefaultTrip.findById(defaultTripId);
      if (!defaultTrip) {
        return res.status(404).json({ message: "Default trip not found" });
      }

      trip = new Trip({
        busId,
        defaultTripId,
        date,
        routeId,
        bookedSeats: [],
      });

      await trip.save();
    }

    res.status(200).json({ trip });
  } catch (error) {
    console.error("Error retrieving or creating trip:", error);
    res.status(500).json({
      message: "Failed to retrieve or create trip",
      error: error.message,
    });
  }
};


module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getOrCreateTripByDetails
};
