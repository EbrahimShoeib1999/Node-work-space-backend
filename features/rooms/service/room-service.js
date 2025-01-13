const RoomRepository = require("../repo/room-repo");

class RoomService {
    async createRoom(data) {
        return await RoomRepository.createRoom(data);
    }

    async getAllRooms(filters) {
        return await RoomRepository.findAllRooms(filters);
    }

    async getRoomById(roomId) {
        const room = await RoomRepository.findRoomById(roomId);
        if (!room) throw new Error("Room not found.");
        return room;
    }

    async updateRoom(roomId, updates) {
        return await RoomRepository.updateRoom(roomId, updates);
    }

    async deleteRoom(roomId) {
        const room = await RoomRepository.findRoomById(roomId);
        if (!room) throw new Error("Room not found.");
        return await RoomRepository.deleteRoom(roomId);
    }
}

module.exports = new RoomService();
