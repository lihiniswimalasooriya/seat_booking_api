const Route = require("../models/Route");
const DefaultTrip = require("../models/DefaultTrip");

const addRoute = async (req, res) => {
  const { startPoint, endPoint, distance, estimatedTime, fare } = req.body;
  try {
    if (!startPoint || !endPoint || !distance || !estimatedTime || !fare) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRoute = new Route({
      startPoint,
      endPoint,
      distance,
      estimatedTime,
      fare,
    });

    await newRoute.save();
    res
      .status(201)
      .json({ message: "Route added successfully", route: newRoute });
  } catch (error) {
    console.error("Error adding route:", error);
    res
      .status(500)
      .json({ message: "Failed to add route", error: error.message });
  }
};

const updateRoute = async (req, res) => {
  const { id } = req.params;
  const { startPoint, endPoint, distance, estimatedTime, fare } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      { startPoint, endPoint, distance, estimatedTime, fare },
      { new: true }
    );

    if (!updatedRoute)
      return res.status(404).json({ message: "Route not found" });

    res
      .status(200)
      .json({ message: "Route updated successfully", route: updatedRoute });
  } catch (error) {
    console.error("Error updating route:", error);
    res
      .status(500)
      .json({ message: "Failed to update route", error: error.message });
  }
};

const deleteRoute = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute)
      return res.status(404).json({ message: "Route not found" });

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res
      .status(500)
      .json({ message: "Failed to delete route", error: error.message });
  }
};

const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();

    if (!routes.length) {
      return res.status(404).json({ message: "No routes found" });
    }

    res.status(200).json({ routes });
  } catch (error) {
    console.error("Error retrieving routes:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve routes", error: error.message });
  }
};

const getRouteById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const defaultTrips = await DefaultTrip.find({ route: id }).populate("bus");

    res.status(200).json({
      route,
      defaultTrips,
    });
  } catch (error) {
    console.error("Error retrieving route with default trips:", error);
    res.status(500).json({
      message: "Failed to retrieve route with default trips",
      error: error.message,
    });
  }
};

const getRoutesByStartPoint = async (req, res) => {
  const { startPoint } = req.query;

  try {
    if (!startPoint) {
      return res.status(400).json({ message: "Start point is required" });
    }

    const routes = await Route.find({ startPoint });

    if (!routes.length) {
      return res
        .status(404)
        .json({ message: "No routes found for the specified start point" });
    }

    res.status(200).json({ routes });
  } catch (error) {
    console.error("Error retrieving routes by start point:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve routes", error: error.message });
  }
};

module.exports = {
  addRoute,
  updateRoute,
  deleteRoute,
  getRoutes,
  getRouteById,
  getRoutesByStartPoint,
};
