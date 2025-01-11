const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

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
    customCssUrl: CSS_URL 
    // swaggerOptions: {
    //     url: "/swagger.json",
    //     dom_id: "#swagger-ui",
    //   },
  }));

  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

  
module.exports = setupSwagger;
