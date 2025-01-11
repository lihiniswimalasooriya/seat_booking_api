const Route = require("../models/Route");
const DefaultTrip = require("../models/DefaultTrip");

/**
 * @swagger
 * /routes:
 *   post:
 *     summary: Add a new route
 *     description: Create a new route with start point, end point, distance, estimated time, and fare.
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startPoint:
 *                 type: string
 *                 description: The starting point of the route.
 *                 example: Colombo
 *               endPoint:
 *                 type: string
 *                 description: The ending point of the route.
 *                 example: Kandy
 *               distance:
 *                 type: number
 *                 description: Distance of the route in kilometers.
 *                 example: 115
 *               estimatedTime:
 *                 type: string
 *                 description: Estimated time to complete the route.
 *                 example: 3 hours
 *               fare:
 *                 type: number
 *                 description: Fare for the route.
 *                 example: 300
 *     responses:
 *       201:
 *         description: Route added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Route added successfully"
 *               route:
 *                 id: "64a7b4c2e9e8e57d2bc12345"
 *                 startPoint: "Colombo"
 *                 endPoint: "Kandy"
 *                 distance: 115
 *                 estimatedTime: "3 hours"
 *                 fare: 300
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to add route
 */
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

/**
 * @swagger
 * /routes/{id}:
 *   put:
 *     summary: Update an existing route
 *     description: Modify details of an existing route using its ID.
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startPoint:
 *                 type: string
 *                 description: The updated starting point.
 *                 example: Colombo
 *               endPoint:
 *                 type: string
 *                 description: The updated ending point.
 *                 example: Kandy
 *               distance:
 *                 type: number
 *                 description: Updated distance in kilometers.
 *                 example: 120
 *               estimatedTime:
 *                 type: string
 *                 description: Updated estimated time.
 *                 example: 3 hours 30 minutes
 *               fare:
 *                 type: number
 *                 description: Updated fare.
 *                 example: 350
 *     responses:
 *       200:
 *         description: Route updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Route updated successfully"
 *               route:
 *                 id: "64a7b4c2e9e8e57d2bc12345"
 *                 startPoint: "Colombo"
 *                 endPoint: "Kandy"
 *                 distance: 120
 *                 estimatedTime: "3 hours 30 minutes"
 *                 fare: 350
 *       404:
 *         description: Route not found
 *       500:
 *         description: Failed to update route
 */

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

/**
 * @swagger
 * /routes/{id}:
 *   delete:
 *     summary: Delete a route
 *     description: Remove an existing route using its ID.
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route to delete.
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Route deleted successfully"
 *       404:
 *         description: Route not found
 *       500:
 *         description: Failed to delete route
 */

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

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all routes
 *     description: Retrieve a list of all routes.
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of routes
 *         content:
 *           application/json:
 *             example:
 *               routes:
 *                 - id: "64a7b4c2e9e8e57d2bc12345"
 *                   startPoint: "Colombo"
 *                   endPoint: "Kandy"
 *                   distance: 115
 *                   estimatedTime: "3 hours"
 *                   fare: 300
 *       404:
 *         description: No routes found
 *       500:
 *         description: Failed to retrieve routes
 */
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

/**
 * @swagger
 * /routes/{id}:
 *   get:
 *     summary: Get a route by ID
 *     description: Retrieve details of a specific route using its ID.
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route to retrieve.
 *     responses:
 *       200:
 *         description: Route details
 *         content:
 *           application/json:
 *             example:
 *               route:
 *                 id: "64a7b4c2e9e8e57d2bc12345"
 *                 startPoint: "Colombo"
 *                 endPoint: "Kandy"
 *                 distance: 115
 *                 estimatedTime: "3 hours"
 *                 fare: 300
 *               defaultTrips:
 *                 - id: "64b8d7c4e5f8a67f4bc23456"
 *                   bus: "64c8d7a4d5f8a27f5cc12345"
 *       404:
 *         description: Route not found
 *       500:
 *         description: Failed to retrieve route
 */
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
