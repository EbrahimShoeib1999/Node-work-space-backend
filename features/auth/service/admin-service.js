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
