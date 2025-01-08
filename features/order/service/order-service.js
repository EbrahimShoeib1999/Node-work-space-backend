const OrderRepository = require("../repo/order-repo");
const { Status } = require("../models/order");
const Inventory = require("../../inventory/models/inventory");
const sequelize = require("../../../core/database"); // Ensure this path is correct
const Client = require("../../client/models/client"); // Corrected import

class OrderService {
  async createOrder(clientId) {
    // Verify that `sequelize` is defined and has the `transaction` method
    if (!sequelize || typeof sequelize.transaction !== "function") {
      throw new Error("Sequelize is not properly initialized.");
    }

    const transaction = await sequelize.transaction(); // Start a new transaction
    try {
      // Validate clientId by checking if the client exists
      const clientExists = await Client.findOne({ where: { id: clientId } });
      if (!clientExists) {
        throw new Error("Invalid client ID");
      }

      // Try to find an existing pending order for the client
      let order = await OrderRepository.findPendingOrderByClientId(clientId, { transaction });

      // If no pending order exists, create a new one
      if (!order) {
        order = await OrderRepository.createOrder(
          {
            clientId,
            status: Status.PENDING, // Use the correct status from the enum
            totalCost: 0,
          },
          { transaction }
        );
      } else if (order.status === Status.PENDING || order.status === Status.PAID) {
        // If the existing order is canceled or paid, create a new order
        order = await OrderRepository.createOrder(
          {
            clientId,
            status: Status.PENDING, // Use the correct status from the enum
            totalCost: 0,
          },
          { transaction }
        );
      }

      // Commit the transaction
      await transaction.commit();
      return order;
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  }
  
  async cancelOrder(orderId) {
    // Verify that `sequelize` is defined and has the `transaction` method
    if (!sequelize || typeof sequelize.transaction !== "function") {
      throw new Error("Sequelize is not properly initialized.");
    }

    const transaction = await sequelize.transaction(); // Start a new transaction
    try {
      // Find the order by ID
      const order = await OrderRepository.findOrderById(orderId, { transaction });

      // Check if the order exists
      if (!order) {
        throw new Error("Order not found");
      }

      // Check if the order is already canceled
      if (order.status === Status.CANCELED) {
        throw new Error("Order is already canceled");
      }

      // Check if the order is paid (you may not want to cancel paid orders)
      if (order.status === Status.PAID) {
        throw new Error("Cannot cancel a paid order");
      }

      // Update the order status to CANCELED
      await OrderRepository.updateOrder(
        orderId,
        { status: Status.CANCELED },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      return { message: "Order canceled successfully", orderId };
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }
  }

  // Other methods (cancelOrder, checkout) remain unchanged
}

module.exports = new OrderService();