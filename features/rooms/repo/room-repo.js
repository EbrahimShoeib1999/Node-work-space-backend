const Room = require("../models/room");
const {Op} = require("sequelize");
const Client = require("../../client/models/client");

class RoomRepository {
    async createRoom(data) {
        try {
            return await Room.create(data);
        } catch (error) {
            console.error("Error creating room:", error);
            throw new Error("Failed to create room.");
        }
    }

    async findAllRooms(query, page = 1, size = 10) {
        try {
            // Calculate offset for pagination
            const offset = (page - 1) * size;

            // Dynamic search query
            const whereClause = {};

            if (query) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${query}%` } }, // Search by name
                    { capacity: { [Op.like]: `%${query}%` } }, // Search by contactInfo\
                    { status: { [Op.like]: `%${query}%` } }, // Search by contactInfo
                    { hourlyRate: { [Op.like]: `%${query}%` } }, // Search by contactInfo

                ];
            }

            // Fetch clients with dynamic search and pagination
            const rooms = await Room.findAll({
                where: whereClause,
                limit: size,   // Number of records per page
                offset: offset, // Skip records for pagination
            });

            // Get total count for pagination
            const totalCount = await Room.count({ where: whereClause });

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / size);

            // Return clients with pagination info
            return {
                data : rooms,
                currentPage: parseInt(page) || 1,
                size : parseInt(size) || 1,
                totalCount,
                totalPages,
            };
        } catch (error) {
            console.error("Error fetching clients:", error);
            throw new Error("Failed to fetch clients.");
        }
    }

    async findRoomById(roomId) {
        try {
            return await Room.findByPk(roomId);
        } catch (error) {
            console.error("Error finding room by ID:", error);
            throw new Error("Failed to retrieve room.");
        }
    }

    async updateRoom(roomId, updates) {
        try {
            const room = await Room.findByPk(roomId);
            if (!room) throw new Error("Room not found.");
            return await room.update(updates);
        } catch (error) {
            console.error("Error updating room:", error);
            throw new Error("Failed to update room.");
        }
    }

    async deleteRoom(roomId) {
        try {
            const room = await Room.findByPk(roomId);
            if (!room) throw new Error("Room not found.");
            await room.destroy();
            return room;
        } catch (error) {
            console.error("Error deleting room:", error);
            throw new Error("Failed to delete room.");
        }
    }
}

module.exports = new RoomRepository();
