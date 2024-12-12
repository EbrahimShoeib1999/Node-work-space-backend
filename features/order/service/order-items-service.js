const OrderItemRepository = require("../repo/order-item-repo");

class OrderItemService {
  async getOrderItemsByOrder(orderId) {
    return await OrderItemRepository.findOrderItemsByOrderId(orderId);
  }

  async deleteOrderItem(id) {
    return await OrderItemRepository.deleteOrderItem(id);
  }
}

module.exports = new OrderItemService();