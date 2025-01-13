const userService = require('../service/updateUserService');
const ApiErrorCode = require("../../../../core/api-error")
const {validateUserUpdate} =require("../utils/updateUserUtils")
exports.updateUser = async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error) {
    return res.status(400).json({
      isSuccessfull: false,
      message: "Validation error",
      error: {
        errorCode: ApiErrorCode.validation,
        message: error.message,
      },
    });
  }
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const updatedUser = await userService.updateUser(id, { username, email });

    if (!updatedUser) {
      return res.status(404).json({
        isSuccessfull: false,
        message: "User not found",
        error: {
          errorCode: ApiErrorCode.notFound
        }
      }

      );
    }

    res.status(200).json({
      isSuccessfull: true,
      message: "User Updated Successfully",
      data: {
        data: updatedUser
      }
    });

  } catch (error) {
    res.status(500).json({
      isSuccessfull: false,
      message: "internal server error ",
      error: {
        errorCode: ApiErrorCode.internalError
      }
    })


  }
};
