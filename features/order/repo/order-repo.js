const  {Order}  = require("../models/order");

console.log(Order); // Check if this logs the Order model

class OrderRepository {
  async findPendingOrderByClientId(clientId, options = {}) {
    return await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem, // The associated model
          as: "OrderItems", // The alias defined in the association
        },
      ],
      ...options, // Pass the transaction here
    });
  }

  async createOrder(data, options = {}) {
    return await Order.create(data, options);
  }

  async findOrderById(orderId, options = {}) {
    return await Order.findByPk(orderId, {
      include: ["OrderItems"],
      ...options,
    });
  }
}

module.exports = new OrderRepository();