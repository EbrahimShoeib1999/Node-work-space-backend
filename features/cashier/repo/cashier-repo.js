const Client = require('../../client/models/client');
const {Timer} = require('../../timer/models/timer');
const Order = require('../../order/models/order');

class CasierRepo {

    async  getActiveClients(req, res) {
    try {
        // Fetch unpaid timers
        const timers = await Timer.findAll({
            where: { paymentStatus: "PENDING" },
            attributes: ['clientId', 'id', 'hourlyRate', 'totalActiveTime', 'totalPrice', 'startTime', 'timerStatus'],
        });

        // Fetch unpaid orders
        const orders = await Order.findAll({
            where: { paymentStatus: "PENDING" },
            attributes: ['clientId', 'id', 'itemName', 'quantity', 'price', 'orderDate'],
        });

        // Group timers by clientId
        const timersByClient = timers.reduce((acc, timer) => {
            if (!acc[timer.clientId]) acc[timer.clientId] = [];
            acc[timer.clientId].push(timer);
            return acc;
        }, {});

        // Group orders by clientId
        const ordersByClient = orders.reduce((acc, order) => {
            if (!acc[order.clientId]) acc[order.clientId] = [];
            acc[order.clientId].push(order);
            return acc;
        }, {});

        // Combine clientIds from both timers and orders
        const clientIds = [...new Set([...Object.keys(timersByClient), ...Object.keys(ordersByClient)])];

        // Fetch client details
        const clients = await Client.findAll({
            where: { id: clientIds },
            attributes: ['id', 'name', 'contactInfo'],
        });

        // Build the response
        const activeClients = clients.map(client => {
            const clientTimers = timersByClient[client.id] || [];
            const clientOrders = ordersByClient[client.id] || [];

            // Calculate the total amount (timers + orders)
            const total = clientTimers.reduce((sum, timer) => sum + timer.totalPrice, 0) +
                clientOrders.reduce((sum, order) => sum + order.price, 0);

            return {
                client: {
                    id: client.id,
                    name: client.name,
                    contactInfo: client.contactInfo,
                },
                timers: clientTimers,
                orders: clientOrders,
                total,
            };
        });

        // Return response
        return res.status(200).json({ data: activeClients });
    } catch (error) {
        console.error('Error fetching active clients:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


}