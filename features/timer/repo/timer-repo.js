const Timer = require("../models/timer");

class TimerRepository {
  async createTimer(data) {
    return await Timer.create(data);
  }

  async findTimerById(id) {
    return await Timer.findByPk(id);
  }

  async findAllTimers() {
    return await Timer.findAll();
  }

  async deleteTimer(id) {
    return await Timer.destroy({ where: { id } });
  }
}

module.exports = new TimerRepository();