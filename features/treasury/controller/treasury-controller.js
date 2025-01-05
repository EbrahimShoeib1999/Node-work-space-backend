const TreasuryService = require('../services/treasury-service');
const ResponseUtils = require('../../../core/response-utils');
const ApiErrorCode = require('../../../core/api-error');
const {treasuryValidationSchema,cashMachineValidationSchema} = require('../utils/treasury-validation');


class TreasuryController {


    async createTransaction(req, res) {
        try {
            const data = req.body;
            const {error} = treasuryValidationSchema.validate(data);

            if (error) return ResponseUtils.error(
                res,
                ApiErrorCode.validation,
                error.message,
                400
            );

            const transaction = await TreasuryService.createTransaction(data);
            ResponseUtils.created(res, "Transaction created successfully.", transaction);

        } catch (error) {
            console.error('Error creating transaction:', error);
            ResponseUtils.error(
                res,
                ApiErrorCode.unknownError,
                error.message,
                500
            );
        }
    }

    async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            const transaction = await TreasuryService.getTransactionById(id);
            if (transaction) {
                ResponseUtils.success(res, "Transaction fetched successfully.", transaction);
            } else {
                ResponseUtils.error(
                    res,
                    ApiErrorCode.notFound,
                    "Transaction not found",
                    404
                );
            }
        } catch (error) {
            console.error('Error fetching transaction by ID:', error);
            ResponseUtils.error(
                res,
                ApiErrorCode.unknownError,
                error.message,
                500
            );
        }
    }

    async getAllTransactions(req, res) {
        try {
            const filters = req.query;
            const transactions = await TreasuryService.getAllTransactions(filters);
            ResponseUtils.success(res, "Transactions fetched successfully.", transactions);
        } catch (error) {
            console.error('Error fetching all transactions:', error);
            ResponseUtils.error(
                res,
                ApiErrorCode.unknownError,
                error.message,
                500
            );
        }
    }

    async cashMachineTransaction(req, res) {
        try {
            const data = req.body;
            const {error} = cashMachineValidationSchema.validate(data);

            if (error) return ResponseUtils.error(
                res,
                ApiErrorCode.validation,
                error.message,
                400
            );

            let transaction;

            if (data.specificType === "cash deposit") {
                transaction = await TreasuryService.depositCash(data.amount);
            } else if (data.specificType === "cash withdrawal") {
                transaction = await TreasuryService.withdrawCash(data.amount);
            }

            ResponseUtils.success(res, "Transaction completed successfully.",transaction);
        } catch (error) {
            console.error('Error doing transaction on cash machine:', error);
            ResponseUtils.error(
                res,
                ApiErrorCode.unknownError,
                error.message,
                500
            );
        }
    }

    async getTreasuryInfo(req, res) {
        try {


            const currentBalance = await TreasuryService.getCashAndTodayVisaIncome()
            const todayAnalytic = await TreasuryService.getTodayIncomeExpensesProfit()

            ResponseUtils.success(res, "Transaction completed successfully.",{
                currentBalance,
                todayAnalytic
            });
        } catch (error) {
            console.error('Error doing transaction on cash machine:', error);
            ResponseUtils.error(
                res,
                ApiErrorCode.unknownError,
                error.message,
                500
            );
        }
    }
}

module.exports = new TreasuryController();
