const InventoryRepository = require("../repo/inventory-repo");

class InventoryService {

  async findInventoryItemById(id){
    return await InventoryRepository.findInventoryItemById(id);
  }

  async createInventoryItem(name, quantity, unit) {
    return await InventoryRepository.createInventoryItem({ name, quantity, unit });
  }

  async updateInventoryQuantity(id, quantity) {
    const inventoryItem = await InventoryRepository.updateInventoryQuantity(id);
    if (!inventoryItem) {
      throw new Error("Inventory item not found");
    }
    return await InventoryRepository.updateInventory(id, { quantity });
  }

  async getAllInventoryItems() {
    return await InventoryRepository.findAllInventoryItems();
  }

  async deleteInventoryItem(id) {
    return await InventoryRepository.deleteInventoryItem(id);
  }
}

module.exports = new InventoryService();
