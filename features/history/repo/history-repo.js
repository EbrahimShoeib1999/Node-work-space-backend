const History  = require("../models/history");
const {AdminUser} = require("../../auth/models/admin-user")

class HistoryRepository {
    // Get all transaction histories with optional filters
    async getAllHistory(filters = {}) {
        try {
            return await History.findAll({
                where: filters ,
                include: [
                    {
                        model: AdminUser,
                        attributes: ["id", "username", "role"], // Fields to include from AdminUser
                    },
                ],
            });
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
