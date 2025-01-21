const TransactionHistoryRepository = require("../repo/history-repo");

class TransactionHistoryService {
    // Fetch all transaction histories with optional filters
    async getAllHistory( query,page,size) {
        try {
            return await TransactionHistoryRepository.getAllHistory(query,page,size);
        } catch (error) {
            console.error("Error in getAllHistory service:", error);
            throw new Error("Failed to retrieve transaction histories.");
        }
    }

    // Create a new transaction history entry
    async createHistory( userId, action, details ) {
       

        if (!userId || !action) {
            throw new Error("User ID and action are required to create a transaction history.");
        }

        const data = {
            userId,
            action,
            details,
        };

        try {
            return await TransactionHistoryRepository.createHistory(data);
        } catch (error) {
            console.error("Error in createHistory service:", error);
            throw new Error("Failed to create transaction history.");
        }
    }

    // Delete a transaction history entry by ID
    async deleteHistoryById(id) {
        if (!id) {
            throw new Error("Transaction history ID is required to delete an entry.");
        }

        try {
            return await TransactionHistoryRepository.deleteHistoryById(id);
        } catch (error) {
            console.error("Error in deleteHistoryById service:", error);
            throw new Error("Failed to delete transaction history.");
        }
    }
}

module.exports = new TransactionHistoryService();
