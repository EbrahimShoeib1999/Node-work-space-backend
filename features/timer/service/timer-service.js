const TimerRepository = require("../repo/timer-repo");

class TimerService {
  async createTimer(clientId, startTime, hourlyRate) {
    return await TimerRepository.createTimer({ clientId, startTime, hourlyRate });
  }

  async endTimer(id, endTime) {
    const timer = await TimerRepository.findTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    const duration = (new Date(endTime) - new Date(timer.startTime)) / 3600000; // Calculate hours
    const totalCost = duration * timer.hourlyRate;
    return await TimerRepository.updateTimer(id, { endTime, totalCost });
  }

  async getTimersByClient(clientId) {
    return await TimerRepository.findTimersByClientId(clientId);
  }

  async deleteTimer(id) {
    return await TimerRepository.deleteTimer(id);
  }
}

module.exports = new TimerService();