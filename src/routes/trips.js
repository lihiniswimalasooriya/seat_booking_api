const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { addTrip, updateTrip, deleteTrip } = require("../controllers/tripController");

const router = express.Router();

router.post("/:busId/trips", authenticate(["admin", "operator"]), addTrip);
router.put("/:busId/trips/:tripId", authenticate(["admin", "operator"]), updateTrip);
router.delete("/:busId/trips/:tripId", authenticate(["admin", "operator"]), deleteTrip);

module.exports = router;