const TimerService = require("../service/timer-service")
const ApiErrorCode = require("../../../core/api-error");
const {timerValidationSchema,payTimerValidationSchema} = require("../utils/timer-validator")

class TimerController {
    // Create a new timer
    async create(req, res) {
        try {
            const { error } = timerValidationSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    isSuccessful: false,
                    message: "Validation error",
                    error: {
                        errorCode: ApiErrorCode.validation,
                        message: error.message,
                    },
                });
            }

            const timer = await TimerService.createTimer(req.body);
            res.status(201).json({
                isSuccessful: true,
                message: "Timer created successfully.",
                data: timer,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Start a timer
    async start(req, res) {
        const { id } = req.params;
        try {
            const timer = await TimerService.startTimer(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Timer started successfully.",
                data: timer,
            });
        } catch (err) {
            res.status(err.message === "Timer not found." ? 404 : 400).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.validation, message: err.message },
            });
        }
    }

    // Pause a timer
    async pause(req, res) {
        const { id } = req.params;
        try {
            const timer = await TimerService.pauseTimer(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Timer paused successfully.",
                data: timer,
            });
        } catch (err) {
            res.status(err.message === "Timer not found." ? 404 : 400).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.validation, message: err.message },
            });
        }
    }

    // End a timer
    async end(req, res) {
        const { id } = req.params;
        try {
            const timer = await TimerService.endTimer(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Timer ended successfully.",
                data: timer,
            });
        } catch (err) {
            res.status(err.message === "Timer not found." ? 404 : 400).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.validation, message: err.message },
            });
        }
    }

    // Calculate the price of a timer
    async calculatePrice(req, res) {
        const { id } = req.params;
        try {
            const priceDetails = await TimerService.calculatePrice(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Price calculated successfully.",
                data: priceDetails,
            });
        } catch (err) {
            res.status(err.message === "Timer not found." ? 404 : 500).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Mark a timer as paid
    async pay(req, res) {
        const { id } = req.params;
        try {
            const { error } = payTimerValidationSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    isSuccessful: false,
                    message: "Validation error",
                    error: {
                        errorCode: ApiErrorCode.validation,
                        message: error.message,
                    },
                });
            }

            const timer = await TimerService.pay(id,req.body.amount,req.body.paymentMethod);
            res.status(200).json({
                isSuccessful: true,
                message: "Timer paid successfully.",
                data: timer,
            });
        } catch (err) {
            res.status(err.message === "Timer not found." ? 404 : 400).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.validation, message: err.message },
            });
        }
    }

    // Get all timers for a client
    async getTimersByClientId(req, res) {
        const { clientId } = req.params;
        try {
            const timers = await TimerService.getTimersByClientId(clientId);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched timers for the client successfully.",
                data: timers,
            });
        } catch (err) {
            res.status(err.message === "Client ID is required to fetch timers." ? 400 : 500).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Delete a timer
    async delete(req, res) {
        const { id } = req.params;
        try {
            const result = await TimerService.deleteTimer(id);
            if (!result) {
                return res.status(404).json({
                    isSuccessful: false,
                    message: "Timer not found.",
                    error: { errorCode: ApiErrorCode.notFound },
                });
            }
            res.status(200).json({
                isSuccessful: true,
                message: "Timer deleted successfully.",
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }
}

module.exports = new TimerController();
