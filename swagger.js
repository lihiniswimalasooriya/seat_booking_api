const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Seat Booking API",
      version: "1.0.0",
      description: "API documentation for the Seat Booking application",
    },
    servers: [
      {
        url: "https://lw-seat-booking-api.vercel.app/" ,
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        url: "/swagger.json",
      },
  }));
};

module.exports = setupSwagger;
