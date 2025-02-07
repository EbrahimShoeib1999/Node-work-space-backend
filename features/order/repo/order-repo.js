const Order  = require("../models/order");
const OrderItem  = require("../models/order-item");
const Inventory  = require("../../inventory/models/inventory");
const {Op, Sequelize} = require("sequelize");
const Client = require('../../client/models/client')

class OrderRepository {

  async createOrder(orderData) {
    return await Order.create(orderData, {
      include: [

        {
          model: OrderItem, // Include OrderItems
          as: "orderItems", // Alias defined in the model association
          include: [
            {
              model: Inventory, // Include Inventory model if you want inventory details
              as: "inventoryItem", // Alias defined in the OrderItem model
            },
          ],
        },
      ],
    });
  }


  async findOrderById(orderId) {
    return await Order.findByPk(orderId, {
      include: [

        {
          model: OrderItem, // Include OrderItems
          as: "orderItems", // Alias defined in the model association
          include: [
            {
              model: Inventory, // Include Inventory model if you want inventory details
              as: "inventoryItem", // Alias defined in the OrderItem model
            },
          ],
        },
      ],
    });
  }

  async findOrdersByClientId(clientId) {
    return await Order.findAll({ where: { clientId },
      include: [

        {
          model: OrderItem, // Include OrderItems
          as: "orderItems", // Alias defined in the model association
          include: [
            {
              model: Inventory, // Include Inventory model if you want inventory details
              as: "inventoryItem", // Alias defined in the OrderItem model
            },
          ],
        },
      ],
    });
  }

  // Helper function to check if a string is a valid UUID
  isValidUUID(value) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  async findAllOrders(query = '', page = 1, size = 10) {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * size;

      const whereClause = {};

      if (query) {
        const orConditions = [];

        // Check if query is a valid UUID
        if (this.isValidUUID(query)) {
          orConditions.push({ id: query }); // Exact match for UUID
        }

        // Add other searchable fields
        orConditions.push(
            Sequelize.where(
                Sequelize.cast(Sequelize.col('payment_status'), 'TEXT'),
                { [Op.iLike]: `%${query}%` }
            ),
            { '$client.name$': { [Op.iLike]: `%${query}%` } } // Correctly reference Client.name
        );

        whereClause[Op.or] = orConditions;
      }


      // Fetch orders with dynamic search, pagination, and include associated OrderItems and Inventory details
      const orders = await Order.findAll({
        where: whereClause,
        limit: size,  // Number of records per page
        offset,        // Skip records for pagination
        order: [['createdAt', 'DESC']], // Sort in descending order (latest first)
        include: [
          {
            model: OrderItem, // Include OrderItems
            as: "orderItems", // Alias defined in the model association
            include: [
              {
                model: Inventory, // Include Inventory model if you want inventory details
                as: "inventoryItem", // Alias defined in the OrderItem model
              },
            ],
          },
          {
            model: Client,  // Include Client model to fetch client details
            required: true,
            as: 'client',
            attributes: ['id', 'name'], // Only include the 'id' and 'name' fields from Client
          },
        ],
      });

      // Get total count of orders that match the query for pagination
      const totalCount = await Order.count({
        where: whereClause ,

        include: [
          {
            model: Client,  // Include Client model to fetch client details
            required: true,
            as: 'client',
            attributes: ['id', 'name'], // Only include the 'id' and 'name' fields from Client
          },
        ]
      });

      // Calculate total pages for pagination
      const totalPages = Math.ceil(totalCount / size);

      // Return paginated data with dynamic search result
      return {
        data: orders,
        currentPage: parseInt(page) || 1,
        size: parseInt(size) || 10,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders.");
    }
  }

  async updateOrder(orderId, updates) {
    return await Order.update(updates, { where: { id: orderId } });
  }

  async deleteOrder(orderId) {
    return await Order.destroy({ where: { id: orderId } });
  }
}

module.exports = new OrderRepository();