const Order  = require("../models/order");
const OrderItem  = require("../models/order-item");
const Inventory  = require("../../inventory/models/inventory");

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

  async findAllOrders() {
    return await Order.findAll({
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

  async updateOrder(orderId, updates) {
    return await Order.update(updates, { where: { id: orderId } });
  }

  async deleteOrder(orderId) {
    return await Order.destroy({ where: { id: orderId } });
  }
}

module.exports = new OrderRepository();
