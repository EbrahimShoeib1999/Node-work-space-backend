const Inventory = require("../models/inventory");

class InventoryRepository {
  async createInventoryItem(data) {
    return await Inventory.create(data);
  }

  async findInventoryItemById(id) {
    return await Inventory.findByPk(id);
  }

  async findAllInventoryItems() {
    return await Inventory.findAll();
  }

  async updateInventoryQuantity(id, quantity) {
    return await Inventory.update({ quantity }, { where: { id } });
  }

  async deleteInventoryItem(id) {
    return await Inventory.destroy({ where: { id } });
  }
}

module.exports = new InventoryRepository();