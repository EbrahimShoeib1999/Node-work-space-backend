const { Op } = require('sequelize');
const Inventory = require("../models/inventory");

class InventoryRepository {

  async createInventoryItem(data) {
    return await Inventory.create(data);
  }

  async findInventoryItemById(id) {
    return await Inventory.findByPk(id);
  }

  async findAllInventoryItems(filters = {}) {
    const { name, supplierId, unitType, minStock, maxStock, sortBy, sortOrder } = filters;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive partial match
    if (supplierId) where.supplier_id = supplierId;
    if (unitType) where.unit_type = unitType;
    if (minStock) where.stock_quantity = { [Op.gte]: minStock };
    if (maxStock) where.stock_quantity = { ...where.stock_quantity, [Op.lte]: maxStock };

    const order = [];
    if (sortBy) order.push([sortBy, sortOrder || 'ASC']); // Default to ascending order

    return await Inventory.findAll({ where, order });
  }

  async updateInventoryItem(id, updates) {
    const [affectedRows] = await Inventory.update(updates, { where: { id } });
    return affectedRows;
  }

  async deleteInventoryItem(id) {
    return await Inventory.destroy({ where: { id } });
  }

}

module.exports = new InventoryRepository();
