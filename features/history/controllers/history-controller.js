const HistoryService = require("../service/history-service");
const ApiErrorCode = require("../../../core/api-error");
const { createTransactionValidationSchema } = require("../utils/history-validation");

class HistoryController {
    // Get all transaction histories
    async getAll(req, res) {
        try {
            const filters = req.query || {};
            const histories = await HistoryService.getAllHistory(filters);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched transaction histories successfully.",
                data: histories,
            });
        } catch (error) {
            console.error("Error fetching transaction histories:", error);
            res.status(500).json({
                isSuccessful: false,
                message: "Server error.",
                error: { errorCode: ApiErrorCode.unknownError, message: error.message },
            });
        }
    }

    // Create a new transaction history
    async create(req, res) {
        const { error } = createTransactionValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Validation error.",
                error: {
                    errorCode: ApiErrorCode.validation,
                    message: error.message,
                },
            });
        }

        try {
            const history = await HistoryService.createHistory(req.body);
            res.status(201).json({
                isSuccessful: true,
                message: "Transaction history created successfully.",
                data: history,
            });
        } catch (error) {
            console.error("Error creating transaction history:", error);
            res.status(500).json({
                isSuccessful: false,
                message: "Server error.",
                error: { errorCode: ApiErrorCode.unknownError, message: error.message },
            });
        }
    }

    // Delete a transaction history by ID
    async delete(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Validation error.",
                error: {
                    errorCode: ApiErrorCode.validation,
                    message: "Transaction history ID is required.",
                },
            });
        }

        try {
            const result = await HistoryService.deleteHistoryById(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Transaction history deleted successfully.",
                data: result,
            });
        } catch (error) {
            console.error("Error deleting transaction history:", error);
            res.status(500).json({
                isSuccessful: false,
                message: "Server error.",
                error: { errorCode: ApiErrorCode.unknownError, message: error.message },
            });
        }
    }
}

module.exports = new HistoryController();
