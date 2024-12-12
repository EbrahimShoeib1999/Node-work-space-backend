const Client = require("../models/client");

class ClientRepository {
  async createClient(data) {
    return await Client.create(data);
  }

  async findClientById(id) {
    return await Client.findByPk(id);
  }

  async findAllClients() {
    return await Client.findAll();
  }

  async deleteClient(id) {
    return await Client.destroy({ where: { id } });
  }
}

module.exports = new ClientRepository();
