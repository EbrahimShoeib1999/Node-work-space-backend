const History  = require("../models/history");
const {AdminUser} = require("../../auth/models/admin-user")
const {Op, Sequelize} = require("sequelize");

class HistoryRepository {
    // Get all transaction histories with optional filters

    async getAllHistory(query, page = 1, size = 10) {
    try {
        // Calculate offset for pagination
        const offset = (page - 1) * size;

        // Dynamic search query
        const whereClause = {};

        if (query) {
            whereClause[Op.or] = [
                Sequelize.where(
                    Sequelize.cast(Sequelize.col("action"), "TEXT"),
                    { [Op.iLike]: `%${query}%` }
                ), // Search by payment status
                { details: { [Op.like]: `%${query}%` } },   // Search by details
            ];
        }

        // Fetch histories with dynamic search and pagination
        const histories = await History.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']], // Sort in descending order (latest first)
            include: [
                {
                    model: AdminUser,
                    attributes: ["id", "username", "role"], // Include specific fields from AdminUser
                },
            ],
            limit: size,  // Number of records per page
            offset: offset, // Skip records for pagination
        });

        // Get total count for pagination
        const totalCount = await History.count({ where: whereClause });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / size);

        // Return histories with pagination info
        return {
            data: histories,
            currentPage: parseInt(page) || 1,
            size: parseInt(size) || 10,
            totalCount,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching transaction histories:", error);
        throw new Error("Failed to fetch transaction histories.");
    }
}

    // Create a new transaction history entry
    async createHistory(data) {
        try {
            return await History.create(data);
        } catch (error) {
            console.error("Error creating transaction history:", error);
            throw new Error("Failed to create transaction history.");
        }
    }

    // Delete a transaction history entry by ID
    async deleteHistoryById(id) {
        try {
            const history = await History.findByPk(id);
            if (!history) {
                throw new Error("Transaction history not found.");
            }
            await history.destroy();
            return history;
        } catch (error) {
            console.error("Error deleting transaction history:", error);
            throw new Error("Failed to delete transaction history.");
        }
    }

    async getLastFiveHistory() {
        try {
            return await History.findAll({
                order: [["createdAt", "DESC"]], // Order by createdAt field in descending order
                limit: 5, // Limit to the last 5 records
                include: [
                    {
                        model: AdminUser,
                        attributes: ["id", "username", "role"], // Fields to include from AdminUser
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching last 5 transaction histories:", error);
            throw new Error("Failed to fetch last 5 transaction histories.");
        }
    }
}

module.exports = new HistoryRepository();
