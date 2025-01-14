const OrderItem  = require("../models/order-item");

class OrderItemRepository {
  async addOrderItem(data) {
    return await OrderItem.create(data);
  }

  async findOrderItemById(orderItemId) {
    return await OrderItem.findByPk(orderItemId);
  }

  async deleteOrderItem(orderItemId) {
    return await OrderItem.destroy({ where: { id: orderItemId } });
  }
}

module.exports = new OrderItemRepository();
