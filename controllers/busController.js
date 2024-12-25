const Bus = require("../models/Bus");
const Route = require("../models/Route");
const DefaultTrip = require("../models/DefaultTrip");

const addBus = async (req, res) => {
  const { busNumber, operator, route, capacity } = req.body;

  try {
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
    console.error(error);
    res.status(500).json({ message: "Failed to add bus", error: error.message });
  }
};

const updateBus = async (req, res) => {
  const { id } = req.params;
  const { busNumber, operator, route, capacity } = req.body;

  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { busNumber, operator, route, capacity },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update bus", error: error.message });
  }
};

const deleteBus = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBus = await Bus.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete bus", error: error.message });
  }
};

const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("operator route");

    res.status(200).json({ buses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve buses", error: error.message });
  }
};

const getBusById = async (req, res) => {
  const { id } = req.params;

  try {
    const bus = await Bus.findById(id).populate("operator route");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve bus", error: error.message });
  }
};

const addDefaultTrip = async (req, res) => {
  const { route, bus, startTime, arrivalTime } = req.body;

  try {
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
    console.error(error);
    res.status(500).json({ message: "Failed to add default trip", error: error.message });
  }
};

const deleteDefaultTrip = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDefaultTrip = await DefaultTrip.findByIdAndDelete(id);

    if (!deletedDefaultTrip) {
      return res.status(404).json({ message: "Default trip not found" });
    }

    res.status(200).json({ message: "Default trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete default trip", error: error.message });
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
};
