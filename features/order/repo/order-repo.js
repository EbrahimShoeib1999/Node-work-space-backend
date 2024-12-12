const { Order, Status} = require("../models/order");
const {OrderItem } = require("../models/order-item");
class OrderRepository {
  async createOrder(data) {
    return Order.create(data, {include: [OrderItem]});
  }

  async findOrderById(id) {
    return await Order.findByPk(id, { include: [OrderItem] });
  }

  // In OrderRepository
  async findPendingOrderByClientId(clientId) {
    return await Order.findOne({
      where: {
        clientId,
        status: Status.PENDING,
      },
      include: [OrderItem], // Include related OrderItem records
    });
  }



  async updateOrder(id, updates) {
    return await Order.update(updates, { where: { id } });
  }

  async deleteOrder(id) {
    return await Order.destroy({ where: { id } });
  }
}

module.exports = new OrderRepository();