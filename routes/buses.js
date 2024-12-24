const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  addBus,
  updateBus,
  deleteBus,
  getBuses,
  getBusById,
} = require("../controllers/busController");

const router = express.Router();

router.post("/", authenticate(["admin", "operator"]), addBus);
router.put("/:id", authenticate(["admin", "operator"]), updateBus);
router.delete("/:id", authenticate(["admin"]), deleteBus);
router.get("/", authenticate(["admin", "operator", "commuter"]), getBuses);
router.get("/:id", authenticate(["admin", "operator", "commuter"]), getBusById);

module.exports = router;
