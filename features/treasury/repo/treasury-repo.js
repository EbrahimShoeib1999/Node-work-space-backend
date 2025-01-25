
const Treasury = require("../models/treasury");
const {Op, Sequelize} = require("sequelize");

class TreasuryRepository {

    async createTransaction(data) {
        return await Treasury.create(data);
    }

    async getTransactionById(id) {
        return await Treasury.findByPk(id);
    }

    async analyzeTransaction(
        from = null,
        to = null,
        transactionType = null,
        specificType = null
    ) {
        try {
            // Set default dates if not provided
            // Set default dates if not provided
            const now = new Date(); // Current date and time
            const defaultTo = to || now; // Use exact current timestamp
            const defaultFrom = from || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago from now

            // Build the where clause for filtering transactions
            const whereClause = {
                createdAt: { // Query using `createdAt` instead of `date`
                    [Op.between]: [defaultFrom, defaultTo],
                },
            };

            // Only include `transactionType` in the filter if it's explicitly provided
            if (transactionType) {
                whereClause.transactionType = transactionType;
            }

            // Only include `specificType` in the filter if it's explicitly provided
            if (specificType) {
                whereClause.specificType = specificType;
            }

            // Fetch records and aggregate the totals
            const results = await Treasury.findAll({
                where: whereClause,
            });

            console.log(whereClause);

            // Calculate totals
            const totalIncome = results
                .filter((record) => record.transactionType === 'income')
                .reduce((sum, record) => sum + parseFloat(record.amount), 0);

            const totalExpense = results
                .filter((record) => record.transactionType === 'expense')
                .reduce((sum, record) => sum + parseFloat(record.amount), 0);

            const netProfit = totalIncome - totalExpense;

            // Return aggregated data
            return {
                totalIncome: totalIncome.toFixed(2),
                totalExpense: totalExpense.toFixed(2),
                netProfit: netProfit.toFixed(2),
                treasuryRecords: results,
            };
        } catch (error) {
            console.error('Error analyzing transactions:', error.message);
            throw Error('Error analyzing transactions: ' + error.message);
        }
    }



    async getAllTransactions(query = '', page = 1, size = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * size;

            // Dynamic search query
            const whereClause = {};
            if (query) {
                whereClause[Op.or] = [
                    { description: { [Op.iLike]: `%${query}%` } }, // Search by description
                    Sequelize.where(
                        Sequelize.cast(Sequelize.col('transaction_type'), 'TEXT'),
                        { [Op.iLike]: `%${query}%` }
                    ),Sequelize.where(
                        Sequelize.cast(Sequelize.col('specific_type'), 'TEXT'),
                        { [Op.iLike]: `%${query}%` }
                    ),Sequelize.where(
                        Sequelize.cast(Sequelize.col('payment_method'), 'TEXT'),
                        { [Op.iLike]: `%${query}%` }
                    ),
                ];
            }


            // Fetch transactions with dynamic search and pagination
            const transactions = await Treasury.findAll({
                where: whereClause,
                limit: size, // Number of records per page
                offset, // Skip records for pagination
            });

            // Get total count of transactions that match the query for pagination
            const totalCount = await Treasury.count({ where: whereClause });

            // Calculate total pages for pagination
            const totalPages = Math.ceil(totalCount / size);

            // Return paginated data with dynamic search result

            return {
                data: transactions,
                currentPage: parseInt(page, 10) || 1,
                size: parseInt(size, 10) || 10,
                totalCount,
                totalPages,
            };
        } catch (error) {
            console.error('Error fetching transactions with query:', error);
            throw new Error('Failed to retrieve transactions.');
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