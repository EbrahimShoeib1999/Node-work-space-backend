const userService = require('../service/updateUserService');
const ApiErrorCode = require("../../../../core/api-error")
const {validateUserUpdate} =require("../utils/updateUserUtils")




exports.updateUser = async (req, res) => {
  // Validate the incoming request body
  const { error } = validateUserUpdate(req.body);
  if (error) {
    return res.status(400).json({
      isSuccessfull: false,
      message: 'Validation error',
      error: {
        errorCode: ApiErrorCode.VALIDATION_ERROR,
        message: error.message,
      },
    });
  }

  try {
    const { id } = req.params;
    const { username, email } = req.body;

    // Call the service function to update the user
    const updatedUser = await userService.updateUser(id, { username, email });

    // If no user is found, return a 404
    if (!updatedUser) {
      return res.status(404).json({
        isSuccessfull: false,
        message: 'User not found',
        error: {
          errorCode: ApiErrorCode.notFound,
        },
      });
    }

    // Success response
    res.status(200).json({
      isSuccessfull: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser, // Return the updated user data
      },
    });

  } catch (err) {
    console.error(err); // Log the error for debugging

    // Return an internal server error if something goes wrong
    res.status(500).json({
      isSuccessfull: false,
      message: 'Internal server error',
      error: {
        errorCode: ApiErrorCode.internalError,
        message: err.message, // Return the error message for debugging
      },
    });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};