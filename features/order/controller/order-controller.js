const OrderService = require("../service/order-service");
const { orderValidationSchema, orderItemValidationSchema } = require("../utils/order-validation");
const ApiErrorCode = require("../../../core/api-error");


class OrderController {

  async createOrder(req, res) {
    try {
      const { error } = orderValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          isSuccessfull: false,
          message: "Validation error",
          error: {
            errorCode: ApiErrorCode.validation,
            message: error.message,
          },
        });
      }

      const { clientId } = req.body;
      const createdOrder = await OrderService.createOrder(clientId);

      res.status(201).json({
        isSuccessfull: true,
        message: "Order created successfully.",
        data: createdOrder,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: err.message,
        },
      });
    }
  }

  async cancelOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.cancelOrder(id);
      res.status(200).json({
        isSuccessfull: true,
        message: "Order canceled successfully.",
        data: order,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: err.message,
        },
      });
    }
  }

  async checkout(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.checkout(id);
      res.status(200).json({
        isSuccessfull: true,
        message: "Order marked as paid.",
        data: order,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: err.message,
        },
      });
    }
  }


  async getOrderItems(req, res) {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    try {
      // Validate pagination parameters
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: 'Invalid page number. It must be a positive integer.' });
      }

      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ error: 'Invalid limit. It must be a positive integer.' });
      }

      // Call the service function
      const result = await orderItemService.getAllOrderItems({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        startDate: startDate || null,
        endDate: endDate || null,
      });

      // Return the result to the client
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getOrderItems:', error.message);

      // Return appropriate error responses
      if (error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }

      if (error.message.includes('unexpected error')) {
        return res.status(500).json({ error: 'Internal server error. Please contact support.' });
      }

      return res.status(500).json({ error: 'Unexpected error. Please try again later.' });
    }
  }

  async addOrderItem(req, res) {
    try {
      const { error } = orderItemValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          isSuccessfull: false,
          message: "Validation error",
          error: {
            errorCode: ApiErrorCode.validation,
            message: error.message,
          },
        });
      }

      const { orderId, inventoryId, quantity } = req.body;
      const newItem = await OrderItemService.addOrderItem(orderId, inventoryId, quantity);

      res.status(201).json({
        isSuccessfull: true,
        message: "Order item added successfully.",
        data: newItem,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: err.message,
        },
      });
    }
  }

  async updateOrderItemQuantity(req, res) {
    const { orderItemId } = req.params;
    const { newQuantity } = req.body;

    try {
      const orderItem = await OrderItemService.updateOrderItemQuantity(orderItemId, newQuantity);
      res.status(200).json({
        isSuccessfull: true,
        message: "Order item quantity updated successfully.",
        data: orderItem,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: err.message,
        },
      });
    }
  }

  async deleteOrderItem(req, res) {
    const { id } = req.params;

    try {
      const deletedItem = await OrderItemService.deleteOrderItem(id);
      res.status(200).json({
        isSuccessfull: true,
        message: "Order item deleted successfully.",
        data: deletedItem,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: err.message,
        },
      });
    }
  }

}

module.exports = new OrderController();

