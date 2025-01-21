const ClientRepo = require("../../client/repo/client-repo");
const TreasuryRepo = require("../../treasury/repo/treasury-repo");
const ReservationRepo = require("../../reservations/repo/reservation-repo");
const TimerRepo = require("../../timer/repo/timer-repo");
const HistoryRepo = require("../../history/repo/history-repo");


class DashboardService {

    async getDashboardData() {
        try {
            // Run all promises concurrently using Promise.all
            const [
                clientStatistics,
                treasuryStatistics,
                reservationStatistics,
                timerStatistics,
                transactions,
                history
            ] = await Promise.all([
                ClientRepo.getUserStatistics(),
                TreasuryRepo.getTreasuryStatistics(),
                ReservationRepo.getReservationStatistics(),
                TimerRepo.getTimersStatistics(),
                TreasuryRepo.getTransactionsForToday(),
                HistoryRepo.getLastFiveHistory()
            ]);

            return {
                statistics: {
                    clientStatistics,
                    treasuryStatistics,
                    reservationStatistics,
                    timerStatistics
                },
                transactions,
                history
            };
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw new Error("Failed to fetch dashboard data.");
        }
    }

}

module.exports = new DashboardService();