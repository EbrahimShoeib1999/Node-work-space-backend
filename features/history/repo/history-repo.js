const History  = require("../models/history");
const AdminUser = require("../../auth/models/admin-user")

class HistoryRepository {
    // Get all transaction histories with optional filters
    async getAllHistory(filters = {}) {
        try {
            return await History.findAll({
                where: filters ,
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
}

module.exports = new HistoryRepository();
