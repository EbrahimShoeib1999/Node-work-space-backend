const TimerRepository = require("../repo/timer-repo");
const { TimerStatuses, PaymentStatuses } = require("../models/timer");
const TreasuryService = require("../../treasury/services/treasury-service")

class TimerService {

  async createTimer(data) {
    return await TimerRepository.createTimer(data);
  }

  async startTimer(timerId) {
    const timer = await TimerRepository.findById(timerId);
    if (!timer) throw new Error("Timer not found.");

    if (![TimerStatuses.PAUSED].includes(timer.timerStatus)) {
      throw new Error("Timer can only be started if it is PENDING or PAUSED.");
    }

    return await TimerRepository.updateTimer(timerId, {
      timerStatus: TimerStatuses.ACTIVE,
      startTime: new Date(),
    });
  }

  async pauseTimer(timerId) {
    const timer = await TimerRepository.findById(timerId);
    if (!timer) throw new Error("Timer not found.");

    if (timer.timerStatus !== TimerStatuses.ACTIVE) {
      throw new Error("Timer can only be paused if it is ACTIVE.");
    }

    const now = new Date();
    const activeDuration = Math.floor((now - timer.startTime) / 1000); // Duration in seconds
    const totalActiveTime = timer.totalActiveTime + activeDuration;
    const totalPrice = (totalActiveTime / 3600) * timer.hourlyRate;

    return await TimerRepository.updateTimer(timerId, {
      timerStatus: TimerStatuses.PAUSED,
      pauseTime: now,
      totalActiveTime,
      totalPrice,
    });
  }

  async endTimer(timerId) {
    const timer = await TimerRepository.findById(timerId);
    if (!timer) throw new Error("Timer not found.");

    if (![TimerStatuses.ACTIVE, TimerStatuses.PAUSED].includes(timer.timerStatus)) {
      throw new Error("Timer can only be ended if it is ACTIVE or PAUSED.");
    }

    const now = new Date();
    let activeDuration = 0;

    if (timer.timerStatus === TimerStatuses.ACTIVE) {
      activeDuration = Math.floor((now - timer.startTime) / 1000); // Duration in seconds
    }

    const totalActiveTime = timer.totalActiveTime + activeDuration;
    const totalPrice = (totalActiveTime / 3600) * timer.hourlyRate;

    return await TimerRepository.updateTimer(timerId, {
      timerStatus: TimerStatuses.ENDED,
      pauseTime: now,
      totalActiveTime,
      totalPrice,
    });
  }

  async calculatePrice(timerId) {
    const timer = await TimerRepository.findById(timerId);
    if (!timer) throw new Error("Timer not found.");

    return {
      totalActiveTime: timer.totalActiveTime,
      totalPrice: timer.totalPrice,
    };
  }

  async deleteTimer(timerId) {
    return await TimerRepository.deleteTimer(timerId);
  }

  async findAll(query) {
    return await TimerRepository.findAll(query);
  }

  async pay(timerId,paymentMethod) {
    const timer = await TimerRepository.findById(timerId);
    if (!timer) throw new Error("Timer not found.");

    if (timer.paymentStatus === PaymentStatuses.PAID) {
      throw new Error("Payment has already been made.");
    }

    const updatedTimer = await TimerRepository.updatePaymentStatus(timerId, PaymentStatuses.PAID);

    await TreasuryService.createTimerTransaction(updatedTimer.totalPrice,paymentMethod)

    return updatedTimer
  }

  async getTimersByClientId(clientId) {
    if (!clientId) {
      throw new Error("Client ID is required to fetch timers.");
    }

    try {
      return await TimerRepository.findByClientId(clientId);
    } catch (error) {
      console.error("Error fetching timers by client ID:", error);
      throw new Error("Failed to fetch timers for the client.");
    }
  }

}

module.exports = new TimerService();

