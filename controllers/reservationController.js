const Reservation = require("../models/Reservation");
const Bus = require("../models/Bus");
const Trip = require("../models/Trip");
const DefaultTrip = require("../models/DefaultTrip");
const Route = require("../models/Route");
const { broadcast } = require("../utils/websocket");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management APIs
 */


/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busId:
 *                 type: string
 *                 description: ID of the bus
 *               defaultTripId:
 *                 type: string
 *                 description: ID of the default trip
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the trip (YYYY-MM-DD)
 *               seatNumber:
 *                 type: integer
 *                 description: Seat number to reserve
 *             required:
 *               - busId
 *               - defaultTripId
 *               - date
 *               - seatNumber
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     commuter:
 *                       type: string
 *                     bus:
 *                       type: string
 *                     trip:
 *                       type: string
 *                     seatNumber:
 *                       type: integer
 *                     paymentStatus:
 *                       type: string
 *       400:
 *         description: Validation errors or missing fields
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       commuter:
 *                         type: string
 *                       bus:
 *                         type: string
 *                       trip:
 *                         type: string
 *                       seatNumber:
 *                         type: integer
 *                       paymentStatus:
 *                         type: string
 *       404:
 *         description: No reservations found
 *       500:
 *         description: Internal server error
 */
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


/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 commuter:
 *                   type: string
 *                 bus:
 *                   type: string
 *                 trip:
 *                   type: string
 *                 seatNumber:
 *                   type: integer
 *                 paymentStatus:
 *                   type: string
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: integer
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid]
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     commuter:
 *                       type: string
 *                     bus:
 *                       type: string
 *                     trip:
 *                       type: string
 *                     seatNumber:
 *                       type: integer
 *                     paymentStatus:
 *                       type: string
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       403:
 *         description: Forbidden, user cannot delete this reservation
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reservations/trip:
 *   get:
 *     summary: Get or create a trip based on details
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: busId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *       - in: query
 *         name: defaultTripId
 *         schema:
 *           type: string
 *         required: true
 *         description: Default trip ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date of the trip (YYYY-MM-DD)
 *       - in: query
 *         name: routeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Trip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 busId:
 *                   type: string
 *                 defaultTripId:
 *                   type: string
 *                 date:
 *                   type: string
 *                 routeId:
 *                   type: string
 *                 bookedSeats:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Internal server error
 */
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
