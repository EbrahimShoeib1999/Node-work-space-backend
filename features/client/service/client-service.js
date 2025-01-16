const ClientRepository = require("../repo/client-repo");

class ClientService {
  async createClient({name, contactInfo}) {
    return await ClientRepository.createClient({ name, contactInfo });
  }

  async getClientById(id) {
    return await ClientRepository.findClientById(id);
  }

  async getAllClients(query, page, size) {
    return await ClientRepository.findAllClients(query, page , size);
  }

  async deleteClient(id) {
    return await ClientRepository.deleteClient(id);
  }

  async updateClient(id, data) {
    return await ClientRepository.updateClient(id, data);
  }

  async getClientsWithActiveTimers(){
    return await ClientRepository.getClientsWithActiveTimers()
  }

}

module.exports = new ClientService();