const { Reservation } = require("../models/reservation");

class ReservationRepository {
    async createReservation(data) {
        try {
            return await Reservation.create(data);
        } catch (error) {
            console.error("Error creating reservation:", error);
            throw new Error("Failed to create reservation.");
        }
    }

    async findAllReservations(query = {}) {
        try {
            return await Reservation.findAll({ where: query });
        } catch (error) {
            console.error("Error fetching reservations:", error);
            throw new Error("Failed to fetch reservations.");
        }
    }

    async findReservationById(reservationId) {
        try {
            return await Reservation.findByPk(reservationId);
        } catch (error) {
            console.error("Error finding reservation by ID:", error);
            throw new Error("Failed to retrieve reservation.");
        }
    }

    async updateReservation(reservationId, updates) {
        try {
            const reservation = await Reservation.findByPk(reservationId);
            if (!reservation) throw new Error("Reservation not found.");
            return await reservation.update(updates);
        } catch (error) {
            console.error("Error updating reservation:", error);
            throw new Error("Failed to update reservation.");
        }
    }

    async deleteReservation(reservationId) {
        try {
            const reservation = await Reservation.findByPk(reservationId);
            if (!reservation) throw new Error("Reservation not found.");
            await reservation.destroy();
            return reservation;
        } catch (error) {
            console.error("Error deleting reservation:", error);
            throw new Error("Failed to delete reservation.");
        }
    }

    /**
     * Find reservations for a room that conflict with the given dates.
     */
    async findConflictingReservations(roomId, fromDate, toDate) {
        try {
            return await Reservation.findAll({
                where: {
                    roomId,
                    [Op.or]: [
                        {
                            fromDate: { [Op.between]: [fromDate, toDate] },
                        },
                        {
                            toDate: { [Op.between]: [fromDate, toDate] },
                        },
                        {
                            fromDate: { [Op.lte]: fromDate },
                            toDate: { [Op.gte]: toDate },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error("Error checking conflicting reservations:", error);
            throw new Error("Failed to check conflicting reservations.");
        }
    }

    async findByClientId(clientId) {
        try {
            return await Reservation.findAll({ where: { clientId } });
        } catch (error) {
            console.error("Error fetching reservations by client ID:", error);
            throw new Error("Failed to retrieve reservations for the client.");
        }
    }

    /**
     * Get reservations by room ID.
     */
    async findByRoomId(roomId) {
        try {
            return await Reservation.findAll({ where: { roomId } });
        } catch (error) {
            console.error("Error fetching reservations by room ID:", error);
            throw new Error("Failed to retrieve reservations for the room.");
        }
    }
}

module.exports = new ReservationRepository();
