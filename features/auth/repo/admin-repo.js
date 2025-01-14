const { Op } = require('sequelize');
const AdminUser = require("../models/admin-user").AdminUser;

class AdminUserRepository {
  async createAdminUser(data) {
    return await AdminUser.create(data);
  }

  async findAdminUserById(id) {
    return await AdminUser.findByPk(id);
  }


  async findAllAdminUsers(query) {
    const whereCondition = query
        ? {
          [Op.or]: [
            { username: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { role: { [Op.like]: `%${query}%` } },
            { balance: { [Op.like]: `%${query}%` } },
            { dailyRate: { [Op.like]: `%${query}%` } },
          ],
        }
        : {}; // If no query is provided, return all records

    return await AdminUser.findAll({ where: whereCondition });
  }


  async deleteAdminUser(id) {
    return await AdminUser.destroy({ where: { id } });
  }

  async findAdminUserByUsername(username) {
    return await AdminUser.findOne({ where: { username } });
  }

  async updateAdminUser(id, updates) {
    const user = await AdminUser.findByPk(id);
    if (!user) {
      return null;
    }
    return await user.update(updates);
  }

  async findAdminUserByEmail(email) {
    return await AdminUser.findOne({ where: { email } });
  }


}

module.exports = new AdminUserRepository();
