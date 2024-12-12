const OrderRepository = require("../repo/order-repo");
const { Status } = require("../models/order");
const Inventory = require("../../inventory/models/inventory");
const { sequelize } = require("../../../core/database");
const OrderItem = require("../models/order-item");


class OrderService {
  // Create an order if it does not exist, or return the existing one if it's in 'PENDING' status
  async createOrder(clientId) {
    const transaction = await sequelize.transaction();
    try {
      // Try to find an existing pending order for the client
      let order = await OrderRepository.findPendingOrderByClientId(clientId);

      // If no pending order exists, create a new one
      if (!order) {
        order = await OrderRepository.createOrder({
          clientId,
          status: Status.PENDING,
          totalCost: 0,
        });
      } else if (order.status === Status.CANCELED || order.status === Status.PAID) {
        // If the existing order is canceled or paid, create a new order
        order = await OrderRepository.createOrder({
          clientId,
          status: Status.PENDING,
          totalCost: 0,
        });
      }

      // Return the order (whether newly created or the existing one)
      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Cancel an order and return the stock to inventory
  async cancelOrder(orderId) {
    const transaction = await sequelize.transaction();
    try {
      const order = await OrderRepository.findOrderById(orderId);
      if (!order || order.status === Status.CANCELED) {
        throw new Error(`Invalid order ID ${orderId}`);
      }

      const items = order.OrderItems;
      for (const item of items) {
        const inventory = await Inventory.findByPk(item.inventoryId);
        if (!inventory) throw new Error(`Inventory not found for ID ${item.inventoryId}`);

        // Return the stock based on the unit type
        if (inventory.unitType === "piece") {
          await inventory.update(
              { stockQuantity: inventory.stockQuantity + item.quantity },
              { transaction }
          );
        } else if (inventory.unitType === "gram") {
          await inventory.update(
              { stockQuantity: inventory.stockQuantity + item.quantity },
              { transaction }
          );
        }
      }

      await order.update({ status: Status.CANCELED }, { transaction });
      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Checkout an order and mark it as paid
  async checkout(orderId) {
    const transaction = await sequelize.transaction();
    try {
      const order = await OrderRepository.findOrderById(orderId);
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      if (order.status !== Status.PENDING) {
        throw new Error(`Order with ID ${orderId} cannot be paid as it is not in PENDING status`);
      }

      await (await order).update({ status: Status.PAID }, { transaction });
      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new OrderService();


