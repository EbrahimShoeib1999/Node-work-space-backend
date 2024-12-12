const { OrderItem } = require("../models/order-item");

class OrderItemRepository {

  // Create a new order item
  async createOrderItem(data) {
    try {
      return await OrderItem.create(data);
    } catch (error) {
      console.error('Error creating order item:', error);
      throw new Error('Failed to create order item');
    }
  }

  // Find order items by order ID
  async findOrderItemsByOrderId(orderId) {
    try {
      return await OrderItem.findAll({ where: { orderId } });
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw new Error('Failed to fetch order items');
    }
  }

  // Find an order item by order ID and inventory ID
  async findOrderItemByOrderAndInventory(orderId, inventoryId) {
    try {
      return await OrderItem.findOne({
        where: {
          orderId,
          inventoryId,
        },
      });
    } catch (error) {
      console.error('Error fetching order item by order and inventory:', error);
      throw new Error('Failed to fetch order item by order and inventory');
    }
  }

  // Delete an order item by its ID
  async deleteOrderItem(id) {
    try {
      const result = await OrderItem.destroy({ where: { id } });
      if (!result) throw new Error('Order item not found');
      return result;
    } catch (error) {
      console.error('Error deleting order item:', error);
      throw new Error('Failed to delete order item');
    }
  }
}

module.exports = new OrderItemRepository();
