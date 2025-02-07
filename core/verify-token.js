const jwt = require("jsonwebtoken");
const ApiErrorCode = require("../core/api-error");
require("dotenv").config();

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      isSuccessful: false,
      message: "This user is not authorized",
      error: {
        errorCode: ApiErrorCode.authorization,
        message: "You must provide a valid Bearer token to execute the method",
      },
    });
  }

  // Extract the token (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to the request
    next();
  } catch (error) {
    res.status(400).json({
      isSuccessful: false,
      message: "Invalid or expired token",
      error: {
        errorCode: ApiErrorCode.authorization,
        message: error.message,
      },
    });
  }
}

// Middleware to check specific role
function validateRole(requiredRole) {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.role === requiredRole) {
        next();
      } else {
        res.status(400).json({
          isSuccessful: false,
          message: "This user is not authorized",
          error: {
            errorCode: ApiErrorCode.authorization,
            message: `You must have ${requiredRole} privileges to use this method`,
          },
        });
      }
    });
  };
}

// Middleware to validate multiple roles
function validateRoles(allowedRoles) {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(400).json({
          isSuccessful: false,
          message: "This user is not authorized",
          error: {
            errorCode: ApiErrorCode.authorization,
            message: `You must have one of the following privileges to use this method: ${allowedRoles.join(
              ", "
            )}`,
          },
        });
      }
    });
  };
}

module.exports = {
  verifyToken,
  validateRole,
  validateRoles,
};
