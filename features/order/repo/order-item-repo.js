const OrderItem  = require("../models/order-item");

class OrderItemRepository {
  async addOrderItem(data) {
    return await OrderItem.create(data);
  }

  async findOrderItemById(orderItemId) {
    return await OrderItem.findByPk(orderItemId);
  }

  async findPreparingOrderItems() {
    try {
      // Find all order items where the status is 'preparing'
      // Return the found items
      return await OrderItem.findAll({
        where: {
          status: 'preparing'
        }
      });
    } catch (error) {
      console.error('Error finding preparing order items:', error.message);
      throw new Error('Error finding preparing order items: ' + error.message);
    }
  }


  async markOrderAsReady(orderId) {

    console.log('markOrderAsRead', orderId);
    const orderItem = await OrderItem.findByPk(orderId)

    if(!orderItem) {
      throw new Error('OrderItem not found');
    }

    return await orderItem.update({
      status: 'ready',
    })

  }

  async deleteOrderItem(orderItemId) {
    return await OrderItem.destroy({ where: { id: orderItemId } });
  }
}

module.exports = new OrderItemRepository();
