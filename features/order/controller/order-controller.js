const OrderService = require("../service/order-service");
const {
  createOrderSchema,
  addOrderItemSchema,
  paymentSchema,
} = require("../utils/order-validation");
const ApiErrorCode = require("../../../core/api-error");

class OrderController {
  async createOrder(req, res) {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Validation error",
        error: {
          errorCode: ApiErrorCode.validation,
          message: error.message,
        },
      });
    }

    try {

      const { clientId, orderItems } = req.body;
      const order = await OrderService.createOrder(clientId, orderItems,req.user.id);
      res.status(201).json({
        isSuccessful: true,
        message: "Order created successfully.",
        data: order,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async getAllOrders(req,res) {

    const {query,page,size} = req.query;

    try {
      const orders = await OrderService.getAllOrders(query,page,size);
      res.status(200).json({
        isSuccessful: true,
        message: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async getOrderById(req,res) {

    const { id } = req.params;

    try {
      const orders = await OrderService.getOrderById(id);
      res.status(200).json({
        isSuccessful: true,
        message: "Order retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async deleteOrder(req, res) {
    const { id } = req.params;

    try {
      const orders = await OrderService.deleteOrder(id,req.user.id);
      res.status(200).json({
        isSuccessful: true,
        message: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }

  }

  async payOrder(req, res) {
    const { id } = req.params;
    const { error } = paymentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Validation error",
        error: {
          errorCode: ApiErrorCode.validation,
          message: error.message,
        },
      });
    }

    try {
      const { paymentMethod } = req.body;
      const order = await OrderService.payOrder(id, paymentMethod,req.user.id);
      res.status(200).json({
        isSuccessful: true,
        message: "Order paid successfully.",
        data: order,
      });
    } catch (err) {
      res.status(err.message === "Order not found." ? 404 : 500).json({
        isSuccessful: false,
        message: err.message,
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async getOrdersByClientId(req, res) {
    const { clientId } = req.params;

    try {
      const orders = await OrderService.getOrdersByClientId(clientId);
      res.status(200).json({
        isSuccessful: true,
        message: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async addOrderItem(req, res) {
    const { error } = addOrderItemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Validation error",
        error: {
          errorCode: ApiErrorCode.validation,
          message: error.message,
        },
      });
    }

    try {
      const { orderId, inventoryItemId, quantity } = req.body;
      const updatedOrder = await OrderService.addOrderItem(orderId, {
        inventoryItemId,
        quantity,
      });

      res.status(200).json({
        isSuccessful: true,
        message: "Order item added successfully.",
        data: updatedOrder,
      });
    } catch (err) {
      res.status(err.message === "Order not found." ? 404 : 500).json({
        isSuccessful: false,
        message: err.message,
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async removeOrderItem(req, res) {
    const { orderItemId } = req.params;

    try {
      const updatedOrder = await OrderService.removeOrderItem( orderItemId);
      res.status(200).json({
        isSuccessful: true,
        message: "Order item removed successfully.",
        data: updatedOrder,
      });
    } catch (err) {
      res.status(err.message === "Order not found." ? 404 : 500).json({
        isSuccessful: false,
        message: err.message,
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async findPreparingOrderItems(req, res) {
    try {
      const orders = await OrderService.findPreparingOrderItems();
      res.status(200).json({
        isSuccessful: true,
        message: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async markOrderAsReady(req, res) {
    const {orderItemId} = req.params;

    try {
      const orders = await OrderService.markOrderAsReady(orderItemId);
      res.status(200).json({
        isSuccessful: true,
        message: "Orders retrieved successfully.",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessful: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

}

module.exports = new OrderController();
