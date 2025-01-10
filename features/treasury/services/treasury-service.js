const TreasuryRepository = require("../repo/treasury-repo");
const Treasury = require("../models/treasury");
class TreasuryService {

    async createTransaction(data) {
        try {
            // Fetch the latest treasury balance
            const lastTransaction = await TreasuryRepository.getLastTransaction()

            const balanceAfterTransaction =
                lastTransaction ? parseFloat(lastTransaction.balanceAfterTransaction) : 0;
            const cashInMachineBefore =
                lastTransaction ? parseFloat(lastTransaction.cashInMachineAfter) : 0;

            let cashInMachineAfter = cashInMachineBefore;

            // If the payment method is cash, update the cash in machine
            if (data.paymentMethod === 'cash') {
                if (data.transactionType === 'income') {
                    cashInMachineAfter += parseFloat(data.amount);
                } else if (data.transactionType === 'expense') {
                    cashInMachineAfter -= parseFloat(data.amount);
                }
            }

            // Calculate the new balance after the transaction
            const newBalance =
                data.transactionType === 'income'
                    ? balanceAfterTransaction + parseFloat(data.amount)
                    : balanceAfterTransaction - parseFloat(data.amount);

            // Create the transaction
            const transaction = await TreasuryRepository.createTransaction(
                {
                    ...data,
                    balanceAfterTransaction: newBalance,
                    cashInMachineBefore,
                    cashInMachineAfter,
                },
            );

            return transaction;
        } catch (error) {
            throw error;
        }
    }

    async getTransactionById(id) {
        return await TreasuryRepository.getTransactionById(id)
    }

    async getAllTransactions(filters = {}) {
        return await TreasuryRepository.getAllTransactions(filters);
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

    async getCashAndTodayVisaIncome() {
        try {
            // Fetch the latest treasury record for cash in machine
            const lastTransaction = await TreasuryRepository.getLastTransaction()


            if (!lastTransaction) {
                throw new Error('No treasury records found');
            }

            // Ensure valid cash in machine data
            const cashInMachine = lastTransaction ? parseFloat(lastTransaction.cashInMachineAfter) : 0;

            if (isNaN(cashInMachine)) {
                throw new Error('Invalid cash_in_machine_after value');
            }

            // Fetch today's total visa income
            const today = new Date().toISOString().split('T')[0];
            const todayVisaIncome = await Treasury.sum('amount', {
                where: {
                    transaction_type: 'income',
                    payment_method: 'visa',
                    date: today,
                },
            });

            const total = cashInMachine + (todayVisaIncome || 0);

            return {
                cashInMachine,
                todayVisaIncome: todayVisaIncome || 0,
                total,
            };
        } catch (error) {
            console.error('Error in getCashAndTodayVisaIncome:', error.message);
            throw new Error(`Failed to fetch cash and today's visa income: ${error.message}`);
        }
    }

    async getTodayIncomeExpensesProfit() {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Calculate today's income
            const todayIncome = await Treasury.sum('amount', {
                where: {
                    transactionType: 'income',
                    date: today,
                },
            });

            // Calculate today's expenses
            const todayExpenses = await Treasury.sum('amount', {
                where: {
                    transactionType: 'expense',
                    date: today,
                },
            });

            const income = todayIncome || 0;
            const expenses = todayExpenses || 0;
            const profit = income - expenses;

            return {
                income,
                expenses,
                profit,
            };
        } catch (error) {
            throw new Error(`Failed to fetch today's incomes, expenses, and profit: ${error.message}`);
        }
    }

    async createTimerTransaction(amount,paymentMethod){
        await this.createTransaction({
            "transactionType": "income",
            "specificType": "timer",
            "amount": amount,
            "description": "timer payment",
            "paymentMethod" : paymentMethod
        });
    }

    async createOrderTransaction(amount,paymentMethod){
        await this.createTransaction({
            "transactionType": "income",
            "specificType": "order",
            "amount": amount,
            "description": "timer payment",
            "paymentMethod" : paymentMethod
        });
    }

    async createReservationTransaction(amount,paymentMethod){
        await this.createTransaction({
            "transactionType": "income",
            "specificType": "reservation",
            "amount": amount,
            "description": "timer payment",
            "paymentMethod" : paymentMethod
        });
    }

}

module.exports = new TreasuryService()