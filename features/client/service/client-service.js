const ClientRepository = require("../repo/client-repo");
const TimerService = require("../../timer/service/timer-service");
const OrderService = require("../../order/service/order-service");

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

  async payForActiveClientTimersAndOrders(clientId, paymentMethod) {
    if (!clientId || !paymentMethod) {
      throw new Error("Client ID and payment method are required.");
    }

    const client = await ClientRepository.getActiveClientById(clientId);

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }

    let successTimers = 0;
    let failedTimers = 0;
    let successOrders = 0;
    let failedOrders = 0;

    // Process timers
    if (client.Timers && client.Timers.length > 0) {
      for (const timer of client.Timers) {
        if (timer.paymentStatus === "PENDING") {
          try {
            await TimerService.pay(timer.id, paymentMethod);
            console.log(`Timer ${timer.id} for client ${client.id} paid successfully.`);
            successTimers++;
          } catch (error) {
            console.error(`Failed to pay timer ${timer.id} for client ${client.id}:`, error);
            failedTimers++;
          }
        }
      }
    }

    // Process orders
    if (client.Orders && client.Orders.length > 0) {
      for (const order of client.Orders) {
        if (order.paymentStatus === "PENDING") {
          try {
            await OrderService.payOrder(order.id, paymentMethod);
            console.log(`Order ${order.id} for client ${client.id} paid successfully.`);
            successOrders++;
          } catch (error) {
            console.error(`Failed to pay order ${order.id} for client ${client.id}:`, error);
            failedOrders++;
          }
        }
      }
    }

    return {
      successTimers,
      failedTimers,
      successOrders,
      failedOrders,
    };
  }

  async getActiveClientById(id){
    return await ClientRepository.getActiveClientById(id)
  }

}

module.exports = new ClientService();