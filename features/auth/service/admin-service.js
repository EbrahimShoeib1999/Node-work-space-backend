const bcrypt = require("bcryptjs");
const AdminUserRepository = require("../repo/admin-repo");
const {sign} = require("jsonwebtoken");

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

    return { token, user };
  }


  async getAdminUserById(id) {
    return await AdminUserRepository.findAdminUserById(id);
  }

  async getAllAdminUsers(query) {
    return await AdminUserRepository.findAllAdminUsers(query);
  }

  async deleteAdminUser(id) {
    return await AdminUserRepository.deleteAdminUser(id);
  }

  async updateAdminUser(id, update) {
    return await AdminUserRepository.updateAdminUser(id, update);
  }
}

module.exports = new AdminUserService();
