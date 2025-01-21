const Client = require("../models/client");
const { Op } = require("sequelize");
const { Timer, PaymentStatuses } = require("../../timer/models/timer");
const Order = require("../../order/models/order");
const OrderItem= require("../../order/models/order-item");
const Inventory= require("../../inventory/models/inventory");

class ClientRepository {
  async createClient(data) {
    return await Client.create(data);
  }

  async findClientById(id) {
    return await Client.findByPk(id);
  }

  async findAllClients(query, page = 1, size = 10) {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * size;

      // Dynamic search query
      const whereClause = {};

      if (query) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${query}%` } }, // Search by name
          { contactInfo: { [Op.like]: `%${query}%` } }, // Search by contactInfo
        ];
      }

      // Fetch clients with dynamic search and pagination
      const clients = await Client.findAll({
        where: whereClause,
        limit: size,   // Number of records per page
        offset: offset, // Skip records for pagination
      });

      // Get total count for pagination
      const totalCount = await Client.count({ where: whereClause });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / size);

      // Return clients with pagination info
      return {
        data : clients,
        currentPage: parseInt(page) || 1,
        size : parseInt(size) || 1,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw new Error("Failed to fetch clients.");
    }
  }


  async deleteClient(id) {
    return await Client.destroy({ where: { id } });
  }

  // Add updateClient method
  async updateClient(id, data) {

     await Client.update(data, {
      where: { id },
    })

    return Client.findByPk(id)

  }

  async getClientsWithActiveTimers() {

      return await Client.findAll({
        include: [
          {
            model: Timer,
            where: { paymentStatus: "PENDING" },
            required: true,
          },
          {
            model: Order,
            where: { paymentStatus: "PENDING" },
            required: false,
            include: [
              {
                model: OrderItem,
                as: "orderItems",
                include: [
                  {
                    model: Inventory,
                    as: "inventoryItem",
                  },
                ],
              },
            ],
          },
        ],
      });


  }

  async getActiveClientById(id) {

    return await Client.findByPk(id,{
      include: [
        {
          model: Timer,
          where: { paymentStatus: "PENDING" },
          required: false,
        },
        {
          model: Order,

          where: { paymentStatus: "PENDING" },
          required: false,
          include: [
            {
              model: OrderItem,
              as: "orderItems",
              include: [
                {
                  model: Inventory,
                  as: "inventoryItem",
                },
              ],
            },
          ],
        },
      ],
    });


  }

  async getUserStatistics() {
    try {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Total users in the database
      const totalUsers = await Client.count();

      // New users this month
      const newUsersThisMonth = await Client.count({
        where: {
          createdAt: { [Op.gte]: startOfThisMonth },
        },
      });

      // New users last month
      const newUsersLastMonth = await Client.count({
        where: {
          createdAt: {
            [Op.gte]: startOfLastMonth,
            [Op.lte]: endOfLastMonth,
          },
        },
      });

      // Calculate percentage growth
      let percentageGrowth = 0;
      if (newUsersLastMonth > 0) {
        percentageGrowth = ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100;
      } else if (newUsersThisMonth > 0) {
        // If there were no users last month, treat this month's users as 100% growth
        percentageGrowth = 100;
      }

      return {
        totalUsers,
        percentageGrowth: percentageGrowth.toFixed(2), // Keep it to 2 decimal places
      };
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw new Error("Failed to fetch user statistics.");
    }
  }


}

module.exports = new ClientRepository();
