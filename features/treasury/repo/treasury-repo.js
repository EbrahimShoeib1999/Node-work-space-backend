
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

    async updateTransaction(id, data) {
        const transaction = await Treasury.findByPk(id);
        if (!transaction) throw new Error('Transaction not found');
        return await transaction.update(data);
    }

    async deleteTransaction(id) {
        const transaction = await Treasury.findByPk(id);
        if (!transaction) throw new Error('Transaction not found');
        return await transaction.destroy();
    }
}

module.exports = new TreasuryRepository();