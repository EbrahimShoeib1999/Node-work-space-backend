const OrderItemRepository = require("../repo/order-item-repo");
const OrderItem = require("../models/order-item");
const {Order} = require("../models/order");
const Inventory = require("../../inventory/models/inventory");
const sequelize = require("../../../core/database");

class OrderItemService {

  // Get order items by order ID
  async getOrderItemsByOrder(orderId) {
    try {
      return await OrderItemRepository.findOrderItemsByOrderId(orderId);
    } catch (error) {
      throw new Error('Failed to fetch order items');
    }
  }

  // Delete an order item by its ID and return stock to inventory
  async deleteOrderItem(id) {
    const transaction = await sequelize.transaction();
    try {
      // Find the order item and the corresponding inventory item
      const orderItem = await OrderItem.findByPk(id);
      if (!orderItem) throw new Error(`Order item with ID ${id} not found`);

      const inventoryItem = await Inventory.findByPk(orderItem.inventoryId);
      if (!inventoryItem) throw new Error(`Inventory item with ID ${orderItem.inventoryId} not found`);

      // Return the stock to the inventory based on unit type
      if (inventoryItem.unitType === "gram") {
        // Convert order quantity to grams if unit type is gram
        const quantityInGrams = orderItem.quantity * 1; // Assuming orderItem.quantity is in grams for grams-based inventory
        await inventoryItem.update({
          stockQuantity: inventoryItem.stockQuantity + quantityInGrams,
        }, { transaction });
      } else {
        await inventoryItem.update({
          stockQuantity: inventoryItem.stockQuantity + orderItem.quantity,
        }, { transaction });
      }

      // Delete the order item
      await orderItem.destroy({ transaction });

      // Update the total cost of the order
      const orderItems = await OrderItemRepository.findOrderItemsByOrderId(orderItem.orderId);
      const newTotalCost = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

      const order = await Order.findByPk(orderItem.orderId);
      await order.update({ totalCost: newTotalCost }, { transaction });

      // Commit the transaction
      await transaction.commit();

      return orderItem;
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting order item:', error);
      throw new Error('Failed to delete order item');
    }
  }

  // Add a new order item to an existing order or increase quantity if it already exists
  async addOrderItem(orderId, inventoryId, quantity) {
    const transaction = await sequelize.transaction();
    try {
      // Find the order and inventory item
      const order = await Order.findByPk(orderId);
      if (!order) throw new Error(`Order with ID ${orderId} not found`);

      const inventoryItem = await Inventory.findByPk(inventoryId);
      if (!inventoryItem) throw new Error(`Inventory item with ID ${inventoryId} not found`);

      // Check if there's enough stock
      if (inventoryItem.unitType === "gram" && inventoryItem.stockQuantity < quantity) {
        throw new Error('Not enough stock in grams');
      } else if (inventoryItem.unitType === "piece" && inventoryItem.stockQuantity < quantity) {
        throw new Error('Not enough stock in pieces');
      }

      // Check if the order item already exists (same order and inventory item)
      let orderItem = await OrderItemRepository.findOrderItemByOrderAndInventory(orderId, inventoryId);

      if (orderItem) {
        // If the order item exists, increase the quantity and update the total price
        orderItem.quantity += quantity;
        orderItem.totalPrice = orderItem.quantity * inventoryItem.pricePerUnit;

        await orderItem.save({ transaction });

      } else {
        // If the order item does not exist, create a new one
        orderItem = await OrderItemRepository.createOrderItem({
          orderId,
          inventoryId,
          quantity,
          totalPrice: inventoryItem.pricePerUnit * quantity,
        }, { transaction });
      }

      // Update the inventory stock by removing the quantity added
      if (inventoryItem.unitType === "gram") {
        // Convert order quantity to grams if unit type is gram
        const quantityInGrams = quantity * 1; // Assuming orderItem.quantity is in grams for grams-based inventory
        await inventoryItem.update({
          stockQuantity: inventoryItem.stockQuantity - quantityInGrams,
        }, { transaction });
      } else {
        await inventoryItem.update({
          stockQuantity: inventoryItem.stockQuantity - quantity,
        }, { transaction });
      }

      // Update the total cost of the order
      const orderItems = await OrderItemRepository.findOrderItemsByOrderId(orderId);
      const newTotalCost = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

      await order.update({ totalCost: newTotalCost }, { transaction });

      // Commit the transaction
      await transaction.commit();

      return orderItem;
    } catch (error) {
      await transaction.rollback();
      console.error('Error adding order item:', error);
      throw new Error('Failed to add order item');
    }
  }

  // Update the quantity of an existing order item
  async updateOrderItemQuantity(orderId, orderItemId, newQuantity) {
    const transaction = await sequelize.transaction();
    try {
      // Find the order item and inventory item
      const orderItem = await OrderItem.findByPk(orderItemId);
      if (!orderItem) throw new Error(`Order item with ID ${orderItemId} not found`);

      const inventoryItem = await Inventory.findByPk(orderItem.inventoryId);
      if (!inventoryItem) throw new Error(`Inventory item with ID ${orderItem.inventoryId} not found`);

      // Check if there's enough stock for the new quantity
      if (inventoryItem.unitType === "gram" && inventoryItem.stockQuantity + orderItem.quantity < newQuantity) {
        throw new Error('Not enough stock to modify the quantity in grams');
      } else if (inventoryItem.unitType === "piece" && inventoryItem.stockQuantity + orderItem.quantity < newQuantity) {
        throw new Error('Not enough stock to modify the quantity in pieces');
      }

      // Adjust inventory stock: remove the added quantity and return the old quantity
      if (inventoryItem.unitType === "gram") {
        const quantityInGrams = newQuantity * 1; // Assuming orderItem.quantity is in grams for grams-based inventory
        await inventoryItem.update({
          stockQuantity: inventoryItem.stockQuantity - (quantityInGrams - orderItem.quantity),
        }, { transaction });
      } else {
        await inventoryItem.update({
          stockQuantity: inventoryItem.stockQuantity - (newQuantity - orderItem.quantity),
        }, { transaction });
      }

      // Calculate the price difference for the quantity update
      const priceDifference = (newQuantity - orderItem.quantity) * inventoryItem.pricePerUnit;
      const totalPrice = orderItem.totalPrice + priceDifference;

      // Update the order item
      await orderItem.update({ quantity: newQuantity, totalPrice }, { transaction });

      // Update the total cost of the order
      const orderItems = await OrderItemRepository.findOrderItemsByOrderId(orderId);
      const newTotalCost = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

      await Order.update({ totalCost: newTotalCost }, { where: { id: orderId } }, { transaction });

      // Commit the transaction
      await transaction.commit();

      return orderItem;
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating order item quantity:', error);
      throw new Error('Failed to update order item quantity');
    }
  }
}

module.exports = new OrderItemService();



