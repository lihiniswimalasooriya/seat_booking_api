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
// const setupSwagger = require("./swagger");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Seat Booking API",
        version: "1.0.0",
        description: "API documentation for the Seat Booking application",
      },
      servers: [
        {
          url: "https://lw-seat-booking-api.vercel.app/"
          // url: "http://localhost:5000/" ,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./routes/auth.js", "./controllers/*.js"],
  };

const specs = swaggerJsDoc(options);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { customCssUrl: CSS_URL })
);

// setupSwagger(app);

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
