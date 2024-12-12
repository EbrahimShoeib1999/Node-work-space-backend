const OrderItem = require("../models/order-item");

class OrderItemRepository {
  async createOrderItem(data) {
    return await OrderItem.create(data);
  }

  async findOrderItemById(id) {
    return await OrderItem.findByPk(id);
  }

  async findOrderItemsByOrderId(orderId){
    return await OrderItem.findAll({ where: { orderId } });
  }

  async findAllOrderItems() {
    return await OrderItem.findAll();
  }

  async deleteOrderItem(id) {
    return await OrderItem.destroy({ where: { id } });
  }
}

module.exports = new OrderItemRepository();