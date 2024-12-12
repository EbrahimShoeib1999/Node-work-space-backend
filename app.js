const express = require("express");
require("dotenv").config({ path: "./config.env" });
const morgan = require("morgan");
const cors = require("cors");

const app = express();

//imports for routers 
const adminUserRouter = require("./features/auth/router/admin-router");


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
