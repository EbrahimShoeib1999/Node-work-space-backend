const ClientRepository = require("../repo/client-repo");

class ClientService {
  async createClient({name, contactInfo}) {
    return await ClientRepository.createClient({ name, contactInfo });
  }

  async getClientById(id) {
    return await ClientRepository.findClientById(id);
  }

  async getAllClients() {
    return await ClientRepository.findAllClients();
  }

  async deleteClient(id) {
    return await ClientRepository.deleteClient(id);
  }

  async updateClient(id, data) {
    return await ClientRepository.updateClient(id, data);
  }

}

module.exports = new ClientService();