const OrderService = require("../service/order-service");
const OrderService = require("../service/order-service");

const { orderValidationSchema, orderItemValidationSchema } = require("../utils/order-validation");
const ApiErrorCode = require("../../../core/api-error");

class OrderController {
  async createOrder(req, res) {{
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

      const { id, orderItems } = req.body;
      const createdOrder = await OrderService.createOrder(id, orderItems);

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
  }}

  async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();

      res.status(200).json({
        isSuccessfull: true,
        message: "Orders retrieved successfully.",
        data: orders,
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

  async getOrderById(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          isSuccessfull: false,
          message: "Order not found",
          error: {
            errorCode: ApiErrorCode.notFound,
          },
        });
      }

      res.status(200).json({
        isSuccessfull: true,
        message: "Order retrieved successfully.",
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

  async deleteOrder(req, res) {
    const { id } = req.params;

    try {
      const result = await OrderService.deleteOrder(id);

      if (!result) {
        return res.status(404).json({
          isSuccessfull: false,
          message: "Order not found",
          error: {
            errorCode: ApiErrorCode.notFound,
          },
        });
      }

      res.status(200).json({
        isSuccessfull: true,
        message: "Order deleted successfully.",
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
