
const Treasury = require("../models/treasury");
const {Op} = require("sequelize");

class TreasuryRepository {

    async createTransaction(data) {
        return await Treasury.create(data);
    }

    async getTransactionById(id) {
        return await Treasury.findByPk(id);
    }

    async getAllTransactions(filters = {}) {
        return await Treasury.findAll({ where: filters });
    }

    async getLastTransaction() {
        return await Treasury.findOne({
            order: [['createdAt', 'DESC']],
        });
    }

    async getTreasuryStatistics() {
        try {
            const now = new Date();
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            // Total amount for this month
            const totalThisMonth = await Treasury.sum('amount', {
                where: {
                    date: {
                        [Op.gte]: startOfThisMonth,
                    },
                },
            });

            // Total amount for last month
            const totalLastMonth = await Treasury.sum('amount', {
                where: {
                    date: {
                        [Op.gte]: startOfLastMonth,
                        [Op.lte]: endOfLastMonth,
                    },
                },
            });

            // Calculate growth percentage
            let growthPercentage = 0;
            if (totalLastMonth > 0) {
                growthPercentage = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
            } else if (totalThisMonth > 0) {
                growthPercentage = 100; // Consider it 100% growth if last month had no transactions
            }

            return {
                totalThisMonth: totalThisMonth || 0,
                totalLastMonth: totalLastMonth || 0,
                growthPercentage: growthPercentage.toFixed(2), // Rounded to 2 decimal places
            };
        } catch (error) {
            console.error("Error fetching treasury statistics:", error);
            throw new Error("Failed to fetch treasury statistics.");
        }
    }

    async getTransactionsForToday() {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0); // Start of the day
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999); // End of the day

            return await Treasury.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startOfToday,
                        [Op.lte]: endOfToday,
                    },
                },
            });
        } catch (error) {
            console.error("Error fetching today's treasury transactions:", error);
            throw new Error("Failed to fetch today's treasury transactions.");
        }
    }
}

module.exports = new TreasuryRepository();