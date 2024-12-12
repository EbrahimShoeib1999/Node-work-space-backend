const InventoryService = require("../service/inventory-service");
const { inventoryValidationSchema } = require("../utils/inventory-validation");
const ApiErrorCode = require("../../../core/api-error");

class InventoryController {
  async create(req, res) {
    try {
      // Validate the request body
      const { error } = inventoryValidationSchema.validate(req.body);
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

      const { name, unitType, stockQuantity, pricePerUnit } = req.body;

      // Create inventory item
      const inventoryItem = await InventoryService.createInventory({
        name,
        unitType,
        stockQuantity,
        pricePerUnit,
      });

      res.status(201).json({
        isSuccessfull: true,
        message: "Inventory item created successfully.",
        data: inventoryItem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: error.message,
        },
      });
    }
  }

  async getAll(req, res) {
    try {
      const inventoryItems = await InventoryService.getAllInventory();

      res.status(200).json({
        isSuccessfull: true,
        message: "Inventory items retrieved successfully.",
        data: inventoryItems,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: error.message,
        },
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const inventoryItem = await InventoryService.getInventoryById(id);

      if (!inventoryItem) {
        return res.status(404).json({
          isSuccessfull: false,
          message: "Inventory item not found",
          error: {
            errorCode: ApiErrorCode.notFound,
            message: "The requested inventory item does not exist.",
          },
        });
      }

      res.status(200).json({
        isSuccessfull: true,
        message: "Inventory item retrieved successfully.",
        data: inventoryItem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: error.message,
        },
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await InventoryService.deleteInventory(id);

      if (!result) {
        return res.status(404).json({
          isSuccessfull: false,
          message: "Inventory item not found",
          error: {
            errorCode: ApiErrorCode.notFound,
            message: "The requested inventory item does not exist.",
          },
        });
      }

      res.status(200).json({
        isSuccessfull: true,
        message: "Inventory item deleted successfully.",
        data: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: {
          errorCode: ApiErrorCode.unknownError,
          message: error.message,
        },
      });
    }
  }
}

module.exports = new InventoryController();
