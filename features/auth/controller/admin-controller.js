const AdminUserService = require("../service/admin-service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { date } = require("joi");
const ApiErrorCode = require("../../../core/api-error")
const {adminUserValidationSchema,adminUserLoginValidationSchema} = require("../utils/admin-validation")
class AdminUserController {

  async login(req, res) {
    try {

        const { error } = adminUserLoginValidationSchema.validate(req.body);

        if (error) {
            return res.status(401).json({
                isSuccessfull: false,
                message: "Validation error",
                error: {
                   errorCode : ApiErrorCode.validation,
                   message : error.message
                }
              });
        }

      const { username, password } = req.body;
  
      // Check if user exists
      const user = await AdminUser.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({
            isSuccessfull: false,
            message: "Invalid username or password",
            error: {
               errorCode : ApiErrorCode.notFound,
               message : error.message
            }
          });
      }
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
            isSuccessfull: false,
            message: "Invalid username or password.",
            error: {
               errorCode : ApiErrorCode.notFound,
               message : error.message
            }
          });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET, // Use a secure secret key in .env
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      res.status(200).json({
        isSuccessfull: true,
        message: "Login successful.",
        date : {
            token,
            user
        },
      });
      
    } catch (err) {
      console.error(err);

      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
           errorCode : ApiErrorCode.unkwonError,
           message : err.message
        }
      });
    }
  };

  async create(req, res) {

    const { error } = adminUserValidationSchema.validate(req.body);

    if (error) {
        return res.status(401).json({
            isSuccessfull: false,
            message: "Validation error",
            error: {
               errorCode : ApiErrorCode.validation,
               message : error.message
            }
          });
    }

    const { username,email, password, role } = req.body;

    try {
      const adminUser = await AdminUserService.createAdminUser(
        username,
        email,
        password,
        role
      );

      res.status(201).json({
        isSuccessfull: true,
        message: "Created user successfully.",
        date : adminUser,
      });

    } catch (error) {
        res.status(500).json({
            isSuccessfull: false,
            message: "Server error",
            error: {
               errorCode : ApiErrorCode.unkwonError,
               message : error.message
            }
          });
    }
  }

  async getAll(req, res) {
    try {
      const adminUsers = await AdminUserService.getAllAdminUsers();
      res.status(201).json({
        isSuccessfull: true,
        message: "Got all users successfully.",
        date : adminUsers,
      });

    } catch (error) {
        res.status(500).json({
            isSuccessfull: false,
            message: "Server error",
            error: {
               errorCode : ApiErrorCode.unkwonError,
               message : error.message
            }
          });
    }
  }

  async getById(req, res) {
    const { id } = req.params;

    try {
      const adminUser = await AdminUserService.getAdminUserById(id);
      if (!adminUser) {
        res.status(500).json({
            isSuccessfull: false,
            message: "Admin user not found",
            error: {
               errorCode : ApiErrorCode.notFound,
               message : error.message
            }
          });
      }

      res.status(201).json({
        isSuccessfull: true,
        message: "Got all users successfully.",
        date : adminUser,
      });

    } catch (error) {
     res.status(500).json({
            isSuccessfull: false,
            message: "Server error",
            error: {
               errorCode : ApiErrorCode.unkwonError,
               message : error.message
            }
          });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const result = await AdminUserService.deleteAdminUser(id);
      if (!result) {
        res.status(500).json({
            isSuccessfull: false,
            message: "Admin user not found",
            error: {
               errorCode : ApiErrorCode.notFound,
               message : error.message
            }
          });
      }

      res.status(201).json({
        isSuccessfull: true,
        message: "Deleted user successfully.",
        date : null,
      });

    } catch (error) {
        res.status(500).json({
            isSuccessfull: false,
            message: "Server error",
            error: {
               errorCode : ApiErrorCode.unkwonError,
               message : error.message
            }
          });
    }
  }


}

module.exports = new AdminUserController();
