const OrderItem  = require("../models/order-item");
const Order = require("../models/order");
const Client = require("../../client/models/client");
const Inventory = require("../../inventory/models/inventory")

class OrderItemRepository {
  async addOrderItem(data) {
    return await OrderItem.create(data);
  }

  async findOrderItemById(orderItemId) {
    return await OrderItem.findByPk(orderItemId);
  }


  async findPreparingOrderItems() {
    try {
      return await OrderItem.findAll({
        where: { status: 'preparing' },
        include: [
          {
            model: Order, // Ensure correct path to the Order model
            as: "order",
            include: [
              {
                model: Client, // Ensure correct path to the Client model
                as: "client",
                attributes: ["id", "name",], // Select only necessary fields
              },
            ],
          },
          {
            model: Inventory, // Ensure correct path to the Inventory model
            as: "inventoryItem",
            attributes: ["id", "name",], // Select only necessary fields
          },
        ],
      });
    } catch (error) {
      console.error("Error finding preparing order items:", error.message);
      throw new Error("Error finding preparing order items: " + error.message);
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
