const { OrderItem } = require("../models/order-item");
const {Op} = require("sequelize");

class OrderItemRepository {


  async getAllOrderItemsPaginated({ page = 1, limit = 10, startDate, endDate }) {
    try {
      const offset = (page - 1) * limit;

      // Build the where clause for filtering by timestamps
      const where = {};
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        where.createdAt = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        where.createdAt = {
          [Op.lte]: new Date(endDate),
        };
      }

      // Execute the query
      const result = await OrderItem.findAndCountAll({
        where,
        offset,
        limit,
        order: [["createdAt", "DESC"]], // Sort by newest first
      });

      // Return the paginated result
      return {
        data: result.rows,
        currentPage: page,
        totalPages: Math.ceil(result.count / limit),
        totalItems: result.count,
      };
    } catch (error) {
      console.error("Error fetching paginated order items:", error);
      throw new Error("Failed to fetch paginated order items");
    }
  }

  // Create a new order item
  async createOrderItem(data) {
    try {
      return await OrderItem.create(data);
    } catch (error) {
      console.error('Error creating order item:', error);
      throw new Error('Failed to create order item');
    }
  }

  // Find order items by order ID
  async findOrderItemsByOrderId(orderId) {
    try {
      return await OrderItem.findAll({ where: { orderId } });
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw new Error('Failed to fetch order items');
    }
  }

  // Find an order item by order ID and inventory ID
  async findOrderItemByOrderAndInventory(orderId, inventoryId) {
    try {
      return await OrderItem.findOne({
        where: {
          orderId,
          inventoryId,
        },
      });
    } catch (error) {
      console.error('Error fetching order item by order and inventory:', error);
      throw new Error('Failed to fetch order item by order and inventory');
    }
  }

  // Delete an order item by its ID
  async deleteOrderItem(id) {
    try {
      const result = await OrderItem.destroy({ where: { id } });
      if (!result) throw new Error('Order item not found');
      return result;
    } catch (error) {
      console.error('Error deleting order item:', error);
      throw new Error('Failed to delete order item');
    }
  }


}

module.exports = new OrderItemRepository();
