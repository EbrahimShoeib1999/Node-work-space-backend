const bcrypt = require("bcryptjs");
const AdminUserRepository = require("../repo/admin-repo");
const {sign} = require("jsonwebtoken");
const HistoryService = require("../../history/service/history-service");

class AdminUserService {
    
  async createAdminUser(username,email, password, role,dailyRate) {
    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      return await AdminUserRepository.createAdminUser({
        username,
        email,
        password: hashedPassword,
        role,
        dailyRate,
      });
    }catch (e) {
      throw new Error(e.message);
    }

  }

  async login(username, password) {
    // Check if user exists
    const user = await AdminUserRepository.findAdminUserByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    // Generate JWT token
    const token = sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET, // Use a secure secret key in .env
      { expiresIn: "24h" } // Token expires in 1 hour
    );

    console.log(user.id);

    await HistoryService.createHistory(user.id,"USER_LOGIN","User logged in");

    return { token, user };
  }

  async changePassword(id, oldPassword, newPassword, confirmNewPassword) {
    try {
      // Validate that the new password and confirmation match
      if (newPassword !== confirmNewPassword) {
        throw new Error("New password and confirmation do not match.");
      }

      // Fetch the user by ID
      const user = await AdminUserRepository.findAdminUserById(id);
      if (!user) {
        throw new Error("User not found.");
      }

      // Validate the old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new Error("Invalid old password.");
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      return await AdminUserRepository.updateAdminUser(id, { password: hashedNewPassword });

    } catch (error) {
      throw new Error(error.message || "Failed to change password.");
    }
  }

  async getAdminUserById(id) {
    return await AdminUserRepository.findAdminUserById(id);
  }

  async getAllAdminUsers(query,page,size) {
    return await AdminUserRepository.findAllAdminUsers(query,page,size);
  }

  async deleteAdminUser(id) {
    return await AdminUserRepository.deleteAdminUser(id);
  }

  async updateAdminUser(id, update) {
    return await AdminUserRepository.updateAdminUser(id, update);
  }

  async updateUserProfile(id, username, email) {
    try {
      // Validate inputs
      if (!username && !email) {
        throw new Error("At least one of username or email must be provided for update.");
      }

      // Fetch the user by ID
      const user = await AdminUserRepository.findAdminUserById(id);
      if (!user) {
        throw new Error("User not found.");
      }

      // Check if email is already taken by another user
      if (email) {
        const emailExists = await AdminUserRepository.findAdminUserByEmail(email);
        if (emailExists && emailExists.id !== id) {
          throw new Error("Email is already in use.");
        }
      }

      // Prepare the fields to update
      const updateFields = {};
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;

      // Update the user profile
      return await AdminUserRepository.updateAdminUser(id, updateFields);
    } catch (error) {
      throw new Error(error.message || "Failed to update user profile.");
    }
  }


}

module.exports = new AdminUserService();
