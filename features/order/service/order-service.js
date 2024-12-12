const OrderRepository = require("../repo/order-repo");
const OrderItemRepository = require("../repo/order-item-repo");
const InventoryService = require("./inventory-service");

class OrderService {
  async createOrder(clientId, items) {
    const order = await OrderRepository.createOrder({ clientId });

    for (const item of items) {
      const inventoryItem = await InventoryService.updateInventoryQuantity(
        item.inventoryId,
        item.unit === "grams"
          ? item.quantity - item.amount
          : item.quantity - 1
      );

      await OrderItemRepository.createOrderItem({
        orderId: order.id,
        inventoryId: item.inventoryId,
        quantity: item.quantity,
        unit: item.unit,
      });
    }

    return order;
  }

  async getOrdersByClient(clientId) {
    return await OrderRepository.findOrdersByClientId(clientId);
  }

  async getOrderDetails(orderId) {
    return {
      order: await OrderRepository.findOrderById(orderId),
      items: await OrderItemRepository.findOrderItemsByOrderId(orderId),
    };
  }

  async deleteOrder(id) {
    return await OrderRepository.deleteOrder(id);
  }
}

module.exports = new OrderService();