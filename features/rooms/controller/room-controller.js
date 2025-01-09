const RoomService = require("../service/room-service");
const ApiErrorCode = require("../../../core/api-error");
const { roomValidationSchema, updateRoomValidationSchema } = require("../utils/room-validation");

class RoomController {
    async create(req, res) {
        const { error } = roomValidationSchema.validate(req.body);
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
            const room = await RoomService.createRoom(req.body);
            res.status(201).json({
                isSuccessful: true,
                message: "Room created successfully.",
                data: room,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    async getAll(req, res) {
        try {
            const filters = req.query || {};
            const rooms = await RoomService.getAllRooms(filters);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched all rooms successfully.",
                data: rooms,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const room = await RoomService.getRoomById(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched room successfully.",
                data: room,
            });
        } catch (err) {
            res.status(err.message === "Room not found." ? 404 : 500).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { error } = updateRoomValidationSchema.validate(req.body);
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
            const room = await RoomService.updateRoom(id, req.body);
            res.status(200).json({
                isSuccessful: true,
                message: "Room updated successfully.",
                data: room,
            });
        } catch (err) {
            res.status(err.message === "Room not found." ? 404 : 500).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            const result = await RoomService.deleteRoom(id);
            res.status(200).json({
                isSuccessful: true,
                message: "Room deleted successfully.",
            });
        } catch (err) {
            res.status(err.message === "Room not found." ? 404 : 500).json({
                isSuccessful: false,
                message: err.message,
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }
}

module.exports = new RoomController();
