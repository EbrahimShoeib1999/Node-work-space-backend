const { Timer } = require("../models/timer");

class TimerRepository {
  async findById(timerId) {
    try {
      return await Timer.findByPk(timerId);
    } catch (error) {
      console.error("Error finding timer by ID:", error);
      throw new Error("Failed to retrieve timer.");
    }
  }

  async findAll(query) {
    try {
      return await Timer.findAll();
    } catch (error) {
      console.error("Error finding timers with query:", error);
      throw new Error("Failed to retrieve timers.");
    }
  }

  async updateTimer(timerId, updates) {
    try {
      const timer = await Timer.findByPk(timerId);
      if (!timer) {
        throw new Error("Timer not found.");
      }
      await timer.update(updates);
      return timer;
    } catch (error) {
      console.error("Error updating timer:", error);
      throw new Error("Failed to update timer.");
    }
  }

  async updatePaymentStatus(timerId, paymentStatus) {
    try {
      const timer = await Timer.findByPk(timerId);
      if (!timer) {
        throw new Error("Timer not found.");
      }
      await timer.update({ paymentStatus });
      return timer;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Failed to update payment status.");
    }
  }

  async createTimer(data) {
    try {
      return await Timer.create(data);
    } catch (error) {
      console.error("Error creating timer:", error);
      throw new Error("Failed to create timer.");
    }
  }

  async deleteTimer(timerId) {
    try {
      const timer = await Timer.findByPk(timerId);
      if (!timer) {
        throw new Error("Timer not found.");
      }
      await timer.destroy();
      return timer;
    } catch (error) {
      console.error("Error deleting timer:", error);
      throw new Error("Failed to delete timer.");
    }
  }

  async findByClientId(clientId) {
    try {
      return await Timer.findAll({ where: { clientId } });
    } catch (error) {
      console.error("Error finding timers by client ID:", error);
      throw new Error("Failed to retrieve timers for the client.");
    }
  }


}

module.exports = new TimerRepository();
