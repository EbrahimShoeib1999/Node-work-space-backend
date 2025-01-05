
const Treasury = require("../models/treasury");

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

    async getTransactionSum(transactionType, date) {
        try {
            const sum = await Treasury.sum('amount', {
                where: {
                    transactionType: transactionType,
                    date: date,
                },
            });
            return sum || 0;
        } catch (error) {
            console.error(`Error fetching sum for ${transactionType} on ${date}:`, error);
            throw new Error(`Failed to fetch sum for ${transactionType}: ${error.message}`);
        }
    }

}

module.exports = new TreasuryRepository();