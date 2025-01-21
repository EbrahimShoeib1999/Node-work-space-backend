const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./core/database"); // Initialize DB
require("./core/associations"); // Initialize associations

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
const adminUserRouter = require("./features/auth/router/admin-router");
const clientRouter = require("./features/client/router/client-router");
const treasuryRouter = require("./features/treasury/router/treasury-router");
const inventoryRouter = require("./features/inventory/router/inventory-router");
const supplierRouter = require("./features/supplier/router/supplier-router");
const timerRouter = require("./features/timer/router/timer-router");
const roomRouter = require("./features/rooms/router/room-router");
const reservationRouter = require("./features/reservations/router/reservation-router");
const historyRouter = require("./features/history/router/history-router");
const orderRouter = require("./features/order/router/order-router")
const dashboardRouter = require("./features/dashborad/router/dashboard-router")

app.use("/api/admin-users", adminUserRouter);
app.use("/api/client", clientRouter);
app.use("/api/treasury", treasuryRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/timer", timerRouter);
app.use("/api/room", roomRouter);
app.use("/api/reservation", reservationRouter);
app.use("/api/history", historyRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboardRouter);

// 404 Handler
app.use((req, res, next) => {
  const error = new Error("Url route not found " + req.url);
  error.status = 404;
  next(error);
});

// General Error Handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    isSuccessful: false,
    message: "There was an error",
    error: { errorCode: 0, message: error.message },
  });
});

module.exports = app;
