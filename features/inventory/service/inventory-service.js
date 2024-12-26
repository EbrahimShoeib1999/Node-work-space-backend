const InventoryRepository = require("../repo/inventory-repo");
const SupplierService = require("../../supplier/services/supplier-service");


class InventoryService {

  async findInventoryItemById(id){
    return await InventoryRepository.findInventoryItemById(id);
  }

  async createInventoryItem(data) {
    await SupplierService.updateSupplierBalance(data.supplierId,-data.totalBuyingPrice)
    return await InventoryRepository.createInventoryItem(data);
  }

  async updateInventoryStock(inventoryItemId, supplierId, quantity, totalBuyingPrice) {
    const inventory = await this.findInventoryItemById(inventoryItemId);

    if (!inventory) {
      throw new Error(`Inventory not found: ${inventoryItemId}`);
    }

    await SupplierService.updateSupplierBalance(supplierId,-totalBuyingPrice)

    const existingStockQuantity = parseFloat(inventory.stockQuantity);
    const existingTotalBuyingPrice = parseFloat(inventory.totalBuyingPrice);

    // Calculate new total buying price
    const newTotalBuyingPrice = existingTotalBuyingPrice + totalBuyingPrice;

    // Calculate new stock quantity
    const newStockQuantity = existingStockQuantity + quantity;

    // Calculate new average unit buying price
    const newUnitBuyingPrice = newTotalBuyingPrice / newStockQuantity;

    // Update inventory
    await InventoryRepository.updateInventoryItem(inventoryItemId, {
      stockQuantity: newStockQuantity,
      totalBuyingPrice: newTotalBuyingPrice,
      unitBuyingPrice: newUnitBuyingPrice,
    });

    return await this.findInventoryItemById(inventoryItemId);
  }

  async returnInventoryStock(inventoryItemId, supplierId, quantity, totalBuyingPrice) {
    const inventory = await this.findInventoryItemById(inventoryItemId);

    if (!inventory) {
      throw new Error(`Inventory not found: ${inventoryItemId}`);
    }

    await SupplierService.updateSupplierBalance(supplierId,totalBuyingPrice)


    // Ensure the inventory has enough stock to return
    const existingStockQuantity = parseFloat(inventory.stockQuantity);
    if (existingStockQuantity < quantity) {
      throw new Error(`Not enough stock to return. Available: ${existingStockQuantity}`);
    }

    const existingTotalBuyingPrice = parseFloat(inventory.totalBuyingPrice);

    // Calculate the new total buying price (subtract the total buying price of the returned stock)
    const newTotalBuyingPrice = existingTotalBuyingPrice - totalBuyingPrice;

    // Calculate the new stock quantity (subtract the returned quantity)
    const newStockQuantity = existingStockQuantity - quantity;

    // Calculate the new unit buying price (adjusting based on the returned stock)
    const newUnitBuyingPrice = newTotalBuyingPrice / newStockQuantity;

    // Update the inventory item
    await InventoryRepository.updateInventoryItem(inventoryItemId, {
      stockQuantity: newStockQuantity,
      totalBuyingPrice: newTotalBuyingPrice,
      unitBuyingPrice: newUnitBuyingPrice,
    });

    // Update the supplier's balance (refund the supplier's cost for the returned stock)
    await SupplierService.updateSupplierBalance(supplierId, totalBuyingPrice);

    return await this.findInventoryItemById(inventoryItemId);
  }

  async getAllInventoryItems(filters) {
    return await InventoryRepository.findAllInventoryItems(filters);
  }

  async deleteInventoryItem(id) {
    return await InventoryRepository.deleteInventoryItem(id);
  }

}

module.exports = new InventoryService();
