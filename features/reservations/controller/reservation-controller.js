const ReservationService = require("../service/reservation-service");
const ApiErrorCode = require("../../../core/api-error");
const {
    createReservationSchema,
    reservationIdSchema,
    clientIdSchema,
    roomIdSchema,
} = require("../utils/reservation-validation");

class ReservationController {

    // Create a new reservation
    async create(req, res) {
        const { error } = createReservationSchema.validate(req.body);
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

        try {
            const reservation = await ReservationService.createReservation(req.body);
            res.status(201).json({
                isSuccessful: true,
                message: "Reservation created successfully.",
                data: reservation,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Get all reservations
    async getAll(req, res) {
        try {
            const reservations = await ReservationService.getAllReservations(req.query);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched all reservations successfully.",
                data: reservations,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Get a reservation by ID
    async getById(req, res) {
        // const { error } = reservationIdSchema.validate(req.params);
        // if (error) {
        //     return res.status(400).json({
        //         isSuccessful: false,
        //         message: "Validation error",
        //         error: {
        //             errorCode: ApiErrorCode.validation,
        //             message: error.message,
        //         },
        //     });
        // }

        try {
            const reservation = await ReservationService.getReservationById(req.params.id);
            if (!reservation) {
                return res.status(404).json({
                    isSuccessful: false,
                    message: "Reservation not found.",
                    error: { errorCode: ApiErrorCode.notFound },
                });
            }
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched reservation successfully.",
                data: reservation,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Pay for a reservation
    async pay(req, res) {
        const { error } = reservationIdSchema.validate(req.body);
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

        try {
            const reservation = await ReservationService.payForReservation(req.params.id,req.body.paymentMethod);
            res.status(200).json({
                isSuccessful: true,
                message: "Reservation paid successfully.",
                data: reservation,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Cancel a reservation
    async cancel(req, res) {
        // const { error } = reservationIdSchema.validate(req.params);
        // if (error) {
        //     return res.status(400).json({
        //         isSuccessful: false,
        //         message: "Validation error",
        //         error: {
        //             errorCode: ApiErrorCode.validation,
        //             message: error.message,
        //         },
        //     });
        // }

        try {
            const result = await ReservationService.cancelReservation(req.params.id);
            if (!result) {
                return res.status(404).json({
                    isSuccessful: false,
                    message: "Reservation not found.",
                    error: { errorCode: ApiErrorCode.notFound },
                });
            }
            res.status(200).json({
                isSuccessful: true,
                message: "Reservation canceled successfully.",
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Get reservations by client ID
    async getByClientId(req, res) {
        const { error } = clientIdSchema.validate(req.params);
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

        try {
            const reservations = await ReservationService.getReservationsByClientId(req.params.clientId);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched reservations by client ID successfully.",
                data: reservations,
            });
        } catch (err) {
            res.status(500).json({        isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Get reservations by room ID
    async getByRoomId(req, res) {
        const { error } = roomIdSchema.validate(req.params);
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

        try {
            const reservations = await ReservationService.getReservationsByRoomId(req.params.roomId);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched reservations by room ID successfully.",
                data: reservations,
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

module.exports = new ReservationController();

