const AdminUser = require("../models/AdminUser");

class AdminUserRepository {
  async createAdminUser(data) {
    return await AdminUser.create(data);
  }

  async findAdminUserById(id) {
    return await AdminUser.findByPk(id);
  }

  async findAllAdminUsers() {
    return await AdminUser.findAll();
  }

  async deleteAdminUser(id) {
    return await AdminUser.destroy({ where: { id } });
  }
}

module.exports = new AdminUserRepository();
