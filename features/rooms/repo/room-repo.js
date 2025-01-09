const Room = require("../models/room");

class RoomRepository {
    async createRoom(data) {
        try {
            return await Room.create(data);
        } catch (error) {
            console.error("Error creating room:", error);
            throw new Error("Failed to create room.");
        }
    }

    async findAllRooms(query = {}) {
        try {
            return await Room.findAll({ where: query });
        } catch (error) {
            console.error("Error fetching rooms:", error);
            throw new Error("Failed to fetch rooms.");
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
