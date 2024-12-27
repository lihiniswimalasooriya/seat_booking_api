const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  addBus,
  updateBus,
  deleteBus,
  getBuses,
  getBusById,
  addDefaultTrip,
  deleteDefaultTrip
} = require("../controllers/busController");

const router = express.Router();

router.post("/defaultTrips", authenticate(["admin", "operator"]), addDefaultTrip);
router.post("/", authenticate(["admin", "operator"]), addBus);
router.put("/:id", authenticate(["admin", "operator"]), updateBus);
router.delete("/defaultTrips/:id", authenticate(["admin", "operator"]), deleteDefaultTrip);
router.delete("/:id", authenticate(["admin"]), deleteBus);
router.get("/", authenticate(["admin", "operator", "commuter"]), getBuses);
router.get("/:id", authenticate(["admin", "operator", "commuter"]), getBusById);

module.exports = router;