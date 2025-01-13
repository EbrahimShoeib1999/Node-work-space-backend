const { OrderItem } = require('./model');

// Create a new order item
exports.createOrderItem = async (req, res) => {
    try {
        const { orderId, productId, quantity, price } = req.body;
        // Validate required fields
        if (!orderId || !price) {
          return res.status(400).json({ error: 'orderId and price are required' });
        }
    
        const orderItem = await OrderItem.create({ orderId, productId, quantity, price });
        res.status(201).json(orderItem);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

// Get all order items
exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an order item by ID
exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order item
exports.updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await OrderItem.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    const updatedOrderItem = await OrderItem.findByPk(id);
    res.status(200).json(updatedOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order item
exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrderItem.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};