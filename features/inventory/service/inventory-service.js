const InventoryRepository = require("../repo/inventory-repo");

class InventoryService {
  async createInventoryItem(name, quantity, unit) {
    return await InventoryRepository.createInventory({ name, quantity, unit });
  }

  async updateInventoryQuantity(id, quantity) {
    const inventoryItem = await InventoryRepository.findInventoryById(id);
    if (!inventoryItem) {
      throw new Error("Inventory item not found");
    }
    return await InventoryRepository.updateInventory(id, { quantity });
  }

  async getAllInventoryItems() {
    return await InventoryRepository.findAllInventory();
  }

  async deleteInventoryItem(id) {
    return await InventoryRepository.deleteInventory(id);
  }
}

module.exports = new InventoryService();
