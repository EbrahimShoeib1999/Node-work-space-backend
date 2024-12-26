const InventoryService = require('../service/inventory-service');
const ResponseUtils = require('../../../core/response-utils');
const ApiErrorCode = require('../../../core/api-error');
const { inventoryValidationSchema,inventoryUpdateValidationSchema } = require('../utils/inventory-validation'); // Assuming you have Joi validation schema for inventory.

class InventoryController {

  async createInventoryItem(req, res) {
    try {
      const data = req.body;
      const { error } = inventoryValidationSchema.validate(data); // Validate request data

      if (error) {
        return ResponseUtils.error(
            res,
            ApiErrorCode.validation,
            error.message,
            400
        );
      }

      const inventoryItem = await InventoryService.createInventoryItem(data); // Call the service to create inventory
      ResponseUtils.created(res, "Inventory item created successfully.", inventoryItem);

    } catch (error) {
      console.error('Error creating inventory item:', error);
      ResponseUtils.error(
          res,
          ApiErrorCode.unknownError,
          error.message,
          500
      );
    }
  }

  async updateInventoryStock(req, res) {
    try {

      const data = req.body;

      const {error} = inventoryUpdateValidationSchema.validate(data)
      if (error) {
        return ResponseUtils.error(
            res,
            ApiErrorCode.validation,
            error.message,
            400
        );
      }

      const { inventoryItemId } = req.params;
      const { supplierId, quantity, totalBuyingPrice } = data;

      const updatedInventory = await InventoryService.updateInventoryStock(
          inventoryItemId,
          supplierId,
          quantity,
          totalBuyingPrice
      );

      ResponseUtils.success(res, "Inventory stock updated successfully.", updatedInventory);
    } catch (error) {
      console.error('Error updating inventory stock:', error);
      ResponseUtils.error(
          res,
          ApiErrorCode.unknownError,
          error.message,
          500
      );
    }
  }

  async returnInventoryStock(req, res) {
    try {
      const data = req.body;

      const {error} = inventoryUpdateValidationSchema.validate(data)
      if (error) {
        return ResponseUtils.error(
            res,
            ApiErrorCode.validation,
            error.message,
            400
        );
      }

      const { inventoryItemId } = req.params;
      const { supplierId, quantity, totalBuyingPrice } = data;

      const returnedInventory = await InventoryService.returnInventoryStock(
          inventoryItemId,
          supplierId,
          quantity,
          totalBuyingPrice
      );

      ResponseUtils.success(res, "Inventory stock returned successfully.", returnedInventory);
    } catch (error) {
      console.error('Error returning inventory stock:', error);
      ResponseUtils.error(
          res,
          ApiErrorCode.unknownError,
          error.message,
          500
      );
    }
  }

  async getAllInventoryItems(req, res) {
    try {
      const filters = req.query;
      const inventoryItems = await InventoryService.getAllInventoryItems(filters);
      ResponseUtils.success(res, "Inventory items fetched successfully.", inventoryItems);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      ResponseUtils.error(
          res,
          ApiErrorCode.unknownError,
          error.message,
          500
      );
    }
  }

  async getInventoryItemById(req, res) {
    try {
      const { id } = req.params;
      const inventoryItem = await InventoryService.findInventoryItemById(id);
      if (inventoryItem) {
        ResponseUtils.success(res, "Inventory item fetched successfully.", inventoryItem);
      } else {
        ResponseUtils.error(
            res,
            ApiErrorCode.notFound,
            "Inventory item not found",
            404
        );
      }
    } catch (error) {
      console.error('Error fetching inventory item by ID:', error);
      ResponseUtils.error(
          res,
          ApiErrorCode.unknownError,
          error.message,
          500
      );
    }
  }

  async deleteInventoryItem(req, res) {
    try {
      const { id } = req.params;
      await InventoryService.deleteInventoryItem(id);
      ResponseUtils.success(res, "Inventory item deleted successfully.");
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      ResponseUtils.error(
          res,
          ApiErrorCode.unknownError,
          error.message,
          500
      );
    }
  }
}

module.exports = new InventoryController();
