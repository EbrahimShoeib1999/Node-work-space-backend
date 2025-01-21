
const Treasury = require("../models/treasury");
const {Op} = require("sequelize");

class TreasuryRepository {

    async createTransaction(data) {
        return await Treasury.create(data);
    }

    async getTransactionById(id) {
        return await Treasury.findByPk(id);
    }

    async getAllTransactions(query = '', page = 1, size = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * size;

            // Dynamic search query
            const whereClause = {};
            if (query) {
                whereClause[Op.or] = [
                    { transactionType: { [Op.iLike]: `%${query}%` } },  // Search by transaction type
                    { specificType: { [Op.iLike]: `%${query}%` } },    // Search by specific transaction type
                    { description: { [Op.iLike]: `%${query}%` } },     // Search by description
                    { paymentMethod: { [Op.iLike]: `%${query}%` } },   // Search by payment method
                    { date: { [Op.iLike]: `%${query}%` } },            // Search by transaction date
                ];
            }

            // Fetch transactions with dynamic search, pagination
            const transactions = await Treasury.findAll({
                where: whereClause,
                limit: size,  // Number of records per page
                offset,        // Skip records for pagination
            });

            // Get total count of transactions that match the query for pagination
            const totalCount = await Treasury.count({ where: whereClause });

            // Calculate total pages for pagination
            const totalPages = Math.ceil(totalCount / size);

            // Return paginated data with dynamic search result
            return {
                data: transactions,
                currentPage: parseInt(page) || 1,
                size: parseInt(size) || 10,
                totalCount,
                totalPages,
            };
        } catch (error) {
            console.error("Error fetching transactions with query:", error);
            throw new Error("Failed to retrieve transactions.");
        }
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