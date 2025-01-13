const jwt = require("jsonwebtoken");
const ApiErrorCode = require("../errors/apiError");

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Attach decoded token to the request
      next();
    } catch (error) {
      res.status(400).json({
        isSuccessful: false,
        message: "This user is not authorized",
        error: {
          errorCode: ApiErrorCode.authorization,
          message: error.message,
        },
      });
    }
  } else {
    res.status(400).json({
      isSuccessful: false,
      message: "This user is not authorized",
      error: {
        errorCode: ApiErrorCode.authorization,
        message: "You must provide a token to execute the method",
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
