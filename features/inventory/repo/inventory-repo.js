const { Op } = require('sequelize');
const Inventory = require("../models/inventory");

class InventoryRepository {

  async createInventoryItem(data) {
    return await Inventory.create(data);
  }

  async findInventoryItemById(id) {
    return await Inventory.findByPk(id);
  }


  async findAllInventoryItems(query = '', page = 1, size = 10) {
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * size;

    // Dynamic search query
    const whereClause = {};
    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } }, // Search by name
        { supplierId: { [Op.iLike]: `%${query}%` } }, // Search by supplierId
        { unitType: { [Op.iLike]: `%${query}%` } }, // Search by unitType
      ];
    }

    // Fetch inventory items with dynamic search, pagination, and sorting
    const inventoryItems = await Inventory.findAll({
      where: whereClause,
      limit: size,  // Number of records per page
      offset,        // Skip records for pagination
    });

    // Get total count of inventory items that match the query for pagination
    const totalCount = await Inventory.count({ where: whereClause });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / size);

    // Return paginated data with dynamic search result
    return {
      data: inventoryItems,
      currentPage: parseInt(page) || 1,
      size: parseInt(size) || 10,
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error("Failed to fetch inventory items.");
  }
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
