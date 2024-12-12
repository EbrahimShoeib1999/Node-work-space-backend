const Order = require("../models/order");

class OrderRepository {
  async createOrder(data) {
    return await Order.create(data);
  }

  async findOrderById(id) {
    return await Order.findByPk(id);
  }

  async findAllOrders() {
    return await Order.findAll();
  }

  async deleteOrder(id) {
    return await Order.destroy({ where: { id } });
  }
}

module.exports = new OrderRepository();