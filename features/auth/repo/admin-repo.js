const AdminUser = require("../models/admin-user").AdminUser;

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

  async findAdminUserByUsername(username) {
    return await AdminUser.findOne({ where: { username } });
  }
}

module.exports = new AdminUserRepository();
