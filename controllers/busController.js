const Bus = require("../models/Bus");
const Route = require("../models/Route");
const DefaultTrip = require("../models/DefaultTrip");

/**
 * @swagger
 * /buses:
 *   post:
 *     summary: Add a new bus
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busNumber:
 *                 type: string
 *                 description: Unique bus number
 *               operator:
 *                 type: string
 *                 description: Operator ID
 *               route:
 *                 type: string
 *                 description: Route ID
 *               capacity:
 *                 type: integer
 *                 description: Bus capacity
 *     responses:
 *       201:
 *         description: Bus added successfully
 *       400:
 *         description: Validation error or bus already exists
 *       500:
 *         description: Server error
 */
const addBus = async (req, res) => {
  const { busNumber, operator, route, capacity } = req.body;

  try {
    if (!busNumber || !operator || !route || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res
        .status(400)
        .json({ message: "Bus with this number already exists" });
    }

    const newBus = new Bus({
      busNumber,
      operator,
      route,
      capacity,
    });

    await newBus.save();

    res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error("Error adding bus:", error);
    res
      .status(500)
      .json({ message: "Failed to add bus", error: error.message });
  }
};

/**
 * @swagger
 * /buses/{id}:
 *   put:
 *     summary: Update a bus
 *     tags: [Buses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bus ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busNumber:
 *                 type: string
 *               operator:
 *                 type: string
 *               route:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       400:
 *         description: Bus ID is required
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Server error
 */
const updateBus = async (req, res) => {
  const { id } = req.params;
  const { busNumber, operator, route, capacity } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { busNumber, operator, route, capacity },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res
      .status(200)
      .json({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    console.error("Error updating bus:", error);
    res
      .status(500)
      .json({ message: "Failed to update bus", error: error.message });
  }
};

/**
 * @swagger
 * /buses/{id}:
 *   delete:
 *     summary: Delete a bus
 *     tags: [Buses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bus ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *       400:
 *         description: Bus ID is required
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Server error
 */
const deleteBus = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const deletedBus = await Bus.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res
      .status(500)
      .json({ message: "Failed to delete bus", error: error.message });
  }
};

/**
 * @swagger
 * /buses:
 *   get:
 *     summary: Retrieve all buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: List of buses retrieved successfully
 *       404:
 *         description: No buses found
 *       500:
 *         description: Server error
 */
const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("operator route");

    if (!buses.length) {
      return res.status(404).json({ message: "No buses found" });
    }

    res.status(200).json({ buses });
  } catch (error) {
    console.error("Error retrieving buses:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve buses", error: error.message });
  }
};

/**
 * @swagger
 * /buses/{id}:
 *   get:
 *     summary: Retrieve a bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bus ID to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus retrieved successfully
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Server error
 */
const getBusById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const bus = await Bus.findById(id).populate("operator route");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ bus });
  } catch (error) {
    console.error("Error retrieving bus:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve bus", error: error.message });
  }
};

/**
 * @swagger
 * /buses/defaultTrips:
 *   get:
 *     summary: Retrieve all default trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of default trips retrieved successfully
 *       404:
 *         description: No trips found
 *       500:
 *         description: Server error
 */
const getAllTrips = async (req, res) => {
  try {
    const trips = await DefaultTrip.find()
      .populate("route", "startPoint endPoint distance estimatedTime fare")
      .populate("bus", "busNumber operator capacity");

    if (!trips.length) {
      return res.status(404).json({ message: "No trips found" });
    }

    res.status(200).json({ trips });
  } catch (error) {
    console.error("Error retrieving trips:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve trips", error: error.message });
  }
};

/**
 * @swagger
 * /buses/defaultTrips:
 *   post:
 *     summary: Add a new default trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route:
 *                 type: string
 *                 description: Route ID
 *               bus:
 *                 type: string
 *                 description: Bus ID
 *               startTime:
 *                 type: string
 *                 description: Start time
 *               arrivalTime:
 *                 type: string
 *                 description: Arrival time
 *     responses:
 *       201:
 *         description: Default trip added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
const addDefaultTrip = async (req, res) => {
  const { route, bus, startTime, arrivalTime } = req.body;

  try {
    if (!route || !bus || !startTime || !arrivalTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundBus = await Bus.findById(bus);
    const foundRoute = await Route.findById(route);

    if (!foundBus) {
      return res.status(400).json({ message: "Bus not found" });
    }

    if (!foundRoute) {
      return res.status(400).json({ message: "Route not found" });
    }

    const newDefaultTrip = new DefaultTrip({
      route,
      bus,
      startTime,
      arrivalTime,
    });

    await newDefaultTrip.save();

    res.status(201).json({
      message: "Default trip added successfully",
      defaultTrip: newDefaultTrip,
    });
  } catch (error) {
    console.error("Error adding default trip:", error);
    res
      .status(500)
      .json({ message: "Failed to add default trip", error: error.message });
  }
};

/**
 * @swagger
 * /buses/defaultTrips/{id}:
 *   delete:
 *     summary: Delete a default trip
 *     tags: [Trips]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Default trip ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default trip deleted successfully
 *       400:
 *         description: Default trip ID is required
 *       404:
 *         description: Default trip not found
 *       500:
 *         description: Server error
 */
const deleteDefaultTrip = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Default trip ID is required" });
    }

    const deletedDefaultTrip = await DefaultTrip.findByIdAndDelete(id);

    if (!deletedDefaultTrip) {
      return res.status(404).json({ message: "Default trip not found" });
    }

    res.status(200).json({ message: "Default trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting default trip:", error);
    res
      .status(500)
      .json({ message: "Failed to delete default trip", error: error.message });
  }
};

module.exports = {
  addBus,
  updateBus,
  deleteBus,
  getBuses,
  getBusById,
  addDefaultTrip,
  deleteDefaultTrip,
  getAllTrips,
};
