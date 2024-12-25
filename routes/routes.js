const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  addRoute,
  updateRoute,
  deleteRoute,
  getRoutes,
  getRouteById,
  getRoutesByStartPoint,
} = require("../controllers/routeController");

const router = express.Router();

router.post("/", authenticate(["admin"]), addRoute);
router.put("/:id", authenticate(["admin"]), updateRoute);
router.delete("/:id", authenticate(["admin"]), deleteRoute);
router.get("/filter", authenticate(["admin", "operator", "commuter"]), getRoutesByStartPoint);
router.get("/", authenticate(["admin", "operator", "commuter"]), getRoutes);
router.get("/:id", authenticate(["admin", "operator", "commuter"]), getRouteById);

module.exports = router;
