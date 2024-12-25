const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config");
const { connectToWebSocket } = require("./utils/websocket");
const authRoutes = require("./routes/auth");
const routeRoutes = require("./routes/routes");
const busRoutes = require("./routes/buses");
const reservationRoutes = require("./routes/reservations");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Bus Reservation System API!");
});

// Routes
app.use("/auth", authRoutes);
app.use("/routes", routeRoutes);
app.use("/buses", busRoutes);
app.use("/reservations", reservationRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectToWebSocket();
