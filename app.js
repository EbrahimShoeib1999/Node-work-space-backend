const express = require("express");
require("dotenv").config({ path: "./config.env" });
const morgan = require("morgan");
const cors = require("cors");
require("./features/auth/utils/balance-updater")
const app = express();

//imports for router
const adminUserRouter = require("./features/auth/router/admin-router");
const clientRouter = require("./features/client/router/client-router");
const treasuryRouter = require("./features/treasury/router/treasury-router");
const inventoryRouter = require("./features/inventory/router/inventory-router");
const supplierRouter = require("./features/supplier/router/supplier-router");
const timerRouter = require("./features/timer/router/timer-router");
const roomRouter = require("./features/rooms/router/room-router");
const reservationRouter = require("./features/reservations/router/reservation-router")
// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Error handling for CORS and preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


// Routes 
app.use("/api/admin-users", adminUserRouter);
app.use("/api/client", clientRouter);
app.use("/api/treasury", treasuryRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/timer", timerRouter);
app.use("/api/room", roomRouter);
app.use("/api/reservation", reservationRouter);




// 404 Error handler for unknown routes
app.use((req, res, next) => {
  const error = new Error("Url route not found");
  error.status = 404;
  next(error);
});

// General error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    isSuccessfull: false,
    message: "There was an error",
    error: {
      errorCode: 0,
      message: error.message,
    },
  });
});

module.exports = app;
