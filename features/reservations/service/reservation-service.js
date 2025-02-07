const ReservationRepository = require("../repo/reservation-repo");
const RoomRepository = require("../../rooms/repo/room-repo");
const { PaymentStatuses } = require("../models/reservation");
const TreasuryService = require("../../treasury/services/treasury-service")
const HistoryService = require("../../history/service/history-service");

class ReservationService {
    /**
     * Create a new reservation for a room while ensuring no date conflicts.
     */
    async createReservation({ roomId, clientId, fromDate, toDate },userId) {
        const room = await RoomRepository.findRoomById(roomId);
        if (!room) throw new Error("Room not found.");

        // Ensure no conflicting reservations for this room
        const conflictingReservations = await ReservationRepository.findConflictingReservations(
            roomId,
            fromDate,
            toDate
        );

        if (conflictingReservations.length > 0) {
            throw new Error("The room is already reserved for the specified dates.");
        }

        // Calculate the total cost based on hourly rate and duration
        const reservationDuration = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60)); // Hours
        if (reservationDuration <= 0) throw new Error("Invalid reservation duration.");

        const totalCost = reservationDuration * room.hourlyRate;

        await HistoryService.createHistory(userId,"RESERVATION","reservation created");

        return await ReservationRepository.createReservation({
            roomId,
            clientId,
            fromDate,
            toDate,
            paymentStatus: PaymentStatuses.PENDING,
            totalCost,
        });
    }

    async payForReservation(reservationId, paymentMethod,userId) {
        const reservation = await ReservationRepository.findReservationById(reservationId);
        if (!reservation) throw new Error("Reservation not found.");
        if (reservation.paymentStatus === PaymentStatuses.PAID) {
            throw new Error("Reservation is already paid.");
        }

        const updatedReservation = await ReservationRepository.updateReservation(reservationId, { paymentStatus: PaymentStatuses.PAID });
        await TreasuryService.createReservationTransaction(reservation.totalCost,paymentMethod)

        await HistoryService.createHistory(userId,"RESERVATION_PAID","reservation was paid");

        return updatedReservation
    }

    async getAllReservations(query,page,size) {
        return await ReservationRepository.findAllReservations(query,page,size);
    }

    async getReservationsByClientId(clientId) {
        if (!clientId) {
            throw new Error("Client ID is required to fetch reservations.");
        }

        try {
            return await ReservationRepository.findByClientId(clientId);
        } catch (error) {
            console.error("Error fetching reservations by client ID:", error);
            throw new Error("Failed to fetch reservations for the client.");
        }
    }

    async getReservationsByRoomId(roomId) {
        if (!roomId) {
            throw new Error("Room ID is required to fetch reservations.");
        }

        try {
            return await ReservationRepository.findByRoomId(roomId);
        } catch (error) {
            console.error("Error fetching reservations by room ID:", error);
            throw new Error("Failed to fetch reservations for the room.");
        }
    }

    async getReservationById(reservationId) {
        const reservation = await ReservationRepository.findReservationById(reservationId);
        if (!reservation) throw new Error("Reservation not found.");
        return reservation;
    }

    async cancelReservation(reservationId,userId) {
        const reservation = await ReservationRepository.findReservationById(reservationId);
        if (!reservation) throw new Error("Reservation not found.");

        await HistoryService.createHistory(userId,"RESERVATION_DELETED","reservation was deleted");


        return await ReservationRepository.deleteReservation(reservationId);
    }
}

module.exports = new ReservationService();
