const TreasuryRepository = require("../repo/treasury-repo");

class TreasuryService {

    async createTransaction(data) {
        // Get the last transaction to fetch the current state
        const lastTransaction = await TreasuryRepository.getLastTransaction();

        // Set the initial values based on whether we have a previous transaction or not
        if (lastTransaction) {
            // If it's an income transaction
            if (data.transactionType === 'income') {
                // Update balance and cash in machine for income
                data.cashInMachineBefore = lastTransaction.cashInMachineAfter;
                data.cashInMachineAfter = parseFloat(lastTransaction.cashInMachineAfter) + parseFloat(data.amount);
                data.balanceAfterTransaction = parseFloat(lastTransaction.balanceAfterTransaction) + parseFloat(data.amount);
            }
            // If it's an expense transaction
            else if (data.transactionType === 'expense') {
                // Ensure we have enough funds in the machine to process the expense
                const cashInMachineBefore = parseFloat(lastTransaction.cashInMachineAfter);
                if (cashInMachineBefore >= parseFloat(data.amount)) {
                    data.cashInMachineBefore = lastTransaction.cashInMachineAfter;
                    data.cashInMachineAfter = cashInMachineBefore - parseFloat(data.amount);
                    data.balanceAfterTransaction = parseFloat(lastTransaction.balanceAfterTransaction) - parseFloat(data.amount);
                } else {
                    throw new Error('Insufficient funds in the machine to complete the expense.');
                }
            }
        } else {
            // For the first transaction (no previous transaction)
            if (data.transactionType === 'income') {
                data.cashInMachineBefore = 0;
                data.cashInMachineAfter = parseFloat(data.amount);
                data.balanceAfterTransaction = parseFloat(data.amount);
            } else if (data.transactionType === 'expense') {
                data.cashInMachineBefore = 0;
                data.cashInMachineAfter = -parseFloat(data.amount);
                data.balanceAfterTransaction = -parseFloat(data.amount);
            }
        }

        // Save the transaction
        return await TreasuryRepository.createTransaction(data);
    }


    async getLastTransaction(){
        return await TreasuryRepository.getLastTransaction();
    }

    async getTransactionById(id) {
        return await TreasuryRepository.getTransactionById(id)
    }

    async getAllTransactions(filters = {}) {
        return await TreasuryRepository.getAllTransactions(filters);
    }

    async deleteTransaction(id){
        return await TreasuryRepository.deleteTransaction(id);
    }

    async depositCash(amount) {
        // Get the last transaction to fetch the current cash in the machine
        const lastTransaction = await TreasuryRepository.getLastTransaction();

        if (lastTransaction) {
            // Update the cash in machine after deposit
            const updatedCashInMachine = parseFloat(lastTransaction.cashInMachineAfter) + parseFloat(amount);

            // Create the transaction data for deposit (balance remains unchanged)
            const transactionData = {
                transactionType: 'income',
                specificType: 'cash deposit',
                amount: amount,
                cashInMachineBefore: lastTransaction.cashInMachineAfter,
                cashInMachineAfter: updatedCashInMachine,
                balanceAfterTransaction: lastTransaction.balanceAfterTransaction // Balance does not change
            };

            // Save the deposit transaction
            return await TreasuryRepository.createTransaction(transactionData);
        } else {
            // Handle the case when there is no previous transaction (first deposit)
            const transactionData = {
                transactionType: 'income',
                specificType: 'cash deposit',
                amount: amount,
                cashInMachineBefore: 0,
                cashInMachineAfter: amount,
                balanceAfterTransaction: 0 // No balance change
            };

            // Save the first deposit transaction
            return await TreasuryRepository.createTransaction(transactionData);
        }
    }


    async withdrawCash(amount) {
        // Get the last transaction to fetch the current cash in the machine
        const lastTransaction = await TreasuryRepository.getLastTransaction();

        if (lastTransaction) {
            // Ensure there is enough cash in the machine to withdraw
            const cashInMachineBeforeWithdrawal = parseFloat(lastTransaction.cashInMachineAfter);
            if (cashInMachineBeforeWithdrawal >= parseFloat(amount)) {
                // Update the cash in machine after withdrawal
                const updatedCashInMachine = cashInMachineBeforeWithdrawal - parseFloat(amount);

                // Create the transaction data for withdrawal (balance remains unchanged)
                const transactionData = {
                    transactionType: 'expense',
                    specificType: 'cash withdrawal',
                    amount: amount,
                    cashInMachineBefore: lastTransaction.cashInMachineAfter,
                    cashInMachineAfter: updatedCashInMachine,
                    balanceAfterTransaction: lastTransaction.balanceAfterTransaction // Balance does not change
                };

                // Save the withdrawal transaction
                return await TreasuryRepository.createTransaction(transactionData);
            } else {
                // If there isn't enough cash in the machine, throw an error
                throw new Error('Insufficient funds in the machine to complete the withdrawal.');
            }
        } else {
            // Handle the case when there is no previous transaction (first withdrawal)
            const transactionData = {
                transactionType: 'expense',
                specificType: 'cash withdrawal',
                amount: amount,
                cashInMachineBefore: 0,
                cashInMachineAfter: -amount, // Withdrawal starts negative
                balanceAfterTransaction: 0 // No balance change
            };

            // Save the first withdrawal transaction
            return await TreasuryRepository.createTransaction(transactionData);
        }
    }


}

module.exports = new TreasuryService()