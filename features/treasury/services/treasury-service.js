const TreasuryRepository = require("../repo/treasury-repo");
const Treasury = require("../models/treasury");
const AdminUserRepository = require("../../auth/repo/admin-repo");
const SupplierRepository = require("../../supplier/repo/supplier-repo");
class TreasuryService {

    async createTransaction(data) {
        try {
            // Fetch the latest treasury balance
            const lastTransaction = await TreasuryRepository.getLastTransaction()

            const balanceAfterTransaction =
                lastTransaction ? parseFloat(lastTransaction.balanceAfterTransaction) : 0;

            const cashInMachineBefore =
                lastTransaction ? parseFloat(lastTransaction.cashInMachineAfter) : 0;
            const visaInMachineBefore =
                lastTransaction ? parseFloat(lastTransaction.visaInMachineAfter) : 0;

            let cashInMachineAfter = cashInMachineBefore;
            let visaInMachineAfter = visaInMachineBefore;

            // If the payment method is cash, update the cash in machine
            if (data.paymentMethod === 'cash') {
                if (data.transactionType === 'income') {
                    cashInMachineAfter += parseFloat(data.amount);
                } else if (data.transactionType === 'expense') {
                    cashInMachineAfter -= parseFloat(data.amount);
                }
            }

            if (data.paymentMethod === 'visa') {
                if (data.transactionType === 'income') {
                    visaInMachineAfter += parseFloat(data.amount);
                } else if (data.transactionType === 'expense') {
                    visaInMachineAfter -= parseFloat(data.amount);
                }
            }



            const isIncome = data.transactionType === 'income';
            const amount = isIncome ? -data.amount : data.amount;

            if (data.specificType === 'suppliers payment') {
                await SupplierRepository.updateSupplierBalance(data.supplierId, amount);
            } else if (data.specificType === 'salary payment') {
                await AdminUserRepository.updateUserBalance(data.adminUserId, amount);
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
                    visaInMachineBefore,
                    visaInMachineAfter
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

    async analyzeTransaction(
        from = null,
        to = null,
        transactionType = null,
        specificType = null
    ){
        return await TreasuryRepository.analyzeTransaction(from, to, transactionType,specificType)
    }

    async getAllTransactions(query,page,size) {
        return await TreasuryRepository.getAllTransactions(query,page,size);
    }



    async depositCash(amount, paymentMethod) {
        // Get the last transaction to fetch the current balance
        const lastTransaction = await TreasuryRepository.getLastTransaction();

        let updatedCashInMachine = lastTransaction ? parseFloat(lastTransaction.cashInMachineAfter) : 0;
        let updatedVisaInMachine = lastTransaction ? parseFloat(lastTransaction.visaInMachineAfter) : 0;

        if (paymentMethod === "cash") {
            updatedCashInMachine += parseFloat(amount);
        } else if (paymentMethod === "visa") {
            updatedVisaInMachine += parseFloat(amount);
        } else {
            throw new Error("Invalid payment method. Allowed methods: cash, visa.");
        }

        const transactionData = {
            transactionType: "income",
            specificType: "cash deposit",
            paymentMethod,
            amount,
            cashInMachineBefore: lastTransaction ? lastTransaction.cashInMachineAfter : 0,
            cashInMachineAfter: updatedCashInMachine,
            visaInMachineBefore: lastTransaction ? lastTransaction.visaInMachineAfter : 0,
            visaInMachineAfter: updatedVisaInMachine,
            balanceAfterTransaction: lastTransaction ? lastTransaction.balanceAfterTransaction : 0,
        };

        return await TreasuryRepository.createTransaction(transactionData);
    }

    async withdrawCash(amount, paymentMethod) {
        // Get the last transaction
        const lastTransaction = await TreasuryRepository.getLastTransaction();

        let cashInMachineBefore = lastTransaction ? parseFloat(lastTransaction.cashInMachineAfter) : 0;
        let visaInMachineBefore = lastTransaction ? parseFloat(lastTransaction.visaInMachineAfter) : 0;

        if (paymentMethod === "cash") {
            if (cashInMachineBefore < parseFloat(amount)) {
                throw new Error("Insufficient cash balance for withdrawal.");
            }
            cashInMachineBefore -= parseFloat(amount);
        } else if (paymentMethod === "visa") {
            if (visaInMachineBefore < parseFloat(amount)) {
                throw new Error("Insufficient Visa balance for withdrawal.");
            }
            visaInMachineBefore -= parseFloat(amount);
        } else {
            throw new Error("Invalid payment method. Allowed methods: cash, visa.");
        }

        const transactionData = {
            transactionType: "expense",
            specificType: "cash withdrawal",
            paymentMethod,
            amount,
            cashInMachineBefore: lastTransaction ? lastTransaction.cashInMachineAfter : 0,
            cashInMachineAfter: cashInMachineBefore,
            visaInMachineBefore: lastTransaction ? lastTransaction.visaInMachineAfter : 0,
            visaInMachineAfter: visaInMachineBefore,
            balanceAfterTransaction: lastTransaction ? lastTransaction.balanceAfterTransaction : 0,
        };

        return await TreasuryRepository.createTransaction(transactionData);
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
            const visaInMachine = lastTransaction ? parseFloat(lastTransaction.visaInMachineAfter) : 0;

            if (isNaN(cashInMachine)) {
                throw new Error('Invalid cash_in_machine_after value');
            }

            if (isNaN(visaInMachine)) {
                throw new Error('Invalid visa_in_machine_after value');
            }


            const total = cashInMachine + visaInMachine;

            return {
                cashInMachine,
                todayVisaIncome: visaInMachine,
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
            "description": "Timer payment",
            "paymentMethod" : paymentMethod
        });
    }

    async createOrderTransaction(amount,paymentMethod){
        await this.createTransaction({
            "transactionType": "income",
            "specificType": "order",
            "amount": amount,
            "description": "Order payment",
            "paymentMethod" : paymentMethod
        });
    }

    async createReservationTransaction(amount,paymentMethod){
        await this.createTransaction({
            "transactionType": "income",
            "specificType": "reservation",
            "amount": amount,
            "description": "Reservation payment",
            "paymentMethod" : paymentMethod
        });
    }

}

module.exports = new TreasuryService()