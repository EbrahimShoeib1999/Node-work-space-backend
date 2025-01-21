const { Op } = require('sequelize');
const AdminUser = require("../models/admin-user").AdminUser;

class AdminUserRepository {
  async createAdminUser(data) {
    return await AdminUser.create(data);
  }

  async findAdminUserById(id) {
    return await AdminUser.findByPk(id);
  }

  async findAllAdminUsers(query, page = 1, size = 10) {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * size;

      // Dynamic search query
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

      // Fetch admin users with dynamic search and pagination
      const adminUsers = await AdminUser.findAll({
        where: whereCondition,
        limit: size,   // Number of records per page
        offset: offset, // Skip records for pagination
      });

      // Get total count for pagination
      const totalCount = await AdminUser.count({ where: whereCondition });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / size);

      // Return admin users with pagination info
      return {
        data: adminUsers,
        currentPage: parseInt(page) || 1,
        size: parseInt(size) || 10,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching admin users:", error);
      throw new Error("Failed to fetch admin users.");
    }
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
