const  {Order}  = require('./model');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { clientId, productId, quantity, status } = req.body; // Ensure clientId is extracted
        const order = await Order.create({ clientId, productId, quantity, status });
        res.status(201).json(order);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Order.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const updatedOrder = await Order.findByPk(id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};