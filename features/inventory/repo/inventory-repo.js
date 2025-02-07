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
          ...(this.isValidUUID(query) ? [{ supplierId: query }] : []), // Search by supplierId
          ...(this.isValidUnitType(query) ? [{ unitType: query }] : []), // Search by unitType if it's valid
        ];
      }

      // Fetch inventory items with dynamic search, pagination, and sorting
      const inventoryItems = await Inventory.findAll({
        where: whereClause,
        limit: size, // Number of records per page
        offset,      // Skip records for pagination
        order: [['createdAt', 'DESC']], // Sort in descending order (latest first)
      });

      // Get total count of inventory items that match the query for pagination
      const totalCount = await Inventory.count({ where: whereClause });

      // Calculate total pages for pagination
      const totalPages = Math.ceil(totalCount / size);

      // Return paginated data with dynamic search result
      return {
        data: inventoryItems,
        currentPage: parseInt(page, 10) || 1,
        size: parseInt(size, 10) || 10,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw new Error('Failed to fetch inventory items.');
    }
  }

// Helper function to check if a string is a valid UUID
   isValidUUID(value) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

// Helper function to check if a query is a valid unit type
   isValidUnitType(value) {
    const validUnitTypes = ['piece', 'gram', 'kilogram', 'litre']; // Add all valid enum values here
    return validUnitTypes.includes(value);
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
