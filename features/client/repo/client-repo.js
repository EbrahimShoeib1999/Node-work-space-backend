const Client = require("../models/client");
const { Op } = require("sequelize");

class ClientRepository {
  async createClient(data) {
    return await Client.create(data);
  }

  async findClientById(id) {
    return await Client.findByPk(id);
  }

  async findAllClients(query, page = 1, size = 10) {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * size;

      // Dynamic search query
      const whereClause = {};

      if (query) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${query}%` } }, // Search by name
          { contactInfo: { [Op.like]: `%${query}%` } }, // Search by contactInfo
        ];
      }

      // Fetch clients with dynamic search and pagination
      const clients = await Client.findAll({
        where: whereClause,
        limit: size,   // Number of records per page
        offset: offset, // Skip records for pagination
      });

      // Get total count for pagination
      const totalCount = await Client.count({ where: whereClause });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / size);

      // Return clients with pagination info
      return {
        clients,
        currentPage: page,
        size,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw new Error("Failed to fetch clients.");
    }
  }


  async deleteClient(id) {
    return await Client.destroy({ where: { id } });
  }

  // Add updateClient method
  async updateClient(id, data) {

     await Client.update(data, {
      where: { id },
    })

    return Client.findByPk(id)

  }

}

module.exports = new ClientRepository();
