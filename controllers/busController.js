const Bus = require("../models/Bus");

const validateTrips = (trips, capacity) => {
  if (!trips || !Array.isArray(trips)) return { valid: true };
  for (const trip of trips) {
    const invalidSeats = (trip.bookedSeats || []).filter(
      (seat) => seat < 1 || seat > capacity
    );
    if (invalidSeats.length > 0) {
      return {
        valid: false,
        message: `Invalid seat numbers in trip: ${invalidSeats.join(", ")}`,
      };
    }
  }
  return { valid: true };
};

const addBus = async (req, res) => {
  const { busNumber, operator, route, capacity, trips } = req.body;

  try {
    const { valid, message } = validateTrips(trips, capacity);
    if (!valid) return res.status(400).json({ message });

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
      trips,
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
  const { busNumber, operator, route, capacity, trips } = req.body;

  try {
    const { valid, message } = validateTrips(trips, capacity);
    if (!valid) return res.status(400).json({ message });

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { busNumber, operator, route, capacity, trips },
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

module.exports = {
  addBus,
  updateBus,
  deleteBus,
  getBuses,
  getBusById,
};
