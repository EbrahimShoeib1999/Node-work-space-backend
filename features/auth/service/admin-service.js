const bcrypt = require("bcryptjs");
const AdminUserRepository = require("../repo/admin-repo");

class AdminUserService {
    
  async createAdminUser(username,email, password, role) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    return await AdminUserRepository.createAdminUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
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
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET, // Use a secure secret key in .env
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return { token, user };
  }


  async getAdminUserById(id) {
    return await AdminUserRepository.findAdminUserById(id);
  }

  async getAllAdminUsers() {
    return await AdminUserRepository.findAllAdminUsers();
  }

  async deleteAdminUser(id) {
    return await AdminUserRepository.deleteAdminUser(id);
  }
}

module.exports = new AdminUserService();
