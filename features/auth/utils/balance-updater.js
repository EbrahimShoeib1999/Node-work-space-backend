const cron = require("node-cron");
const { AdminUser } = require("../models/admin-user"); // Adjust path as needed
const { Sequelize } = require("sequelize");

// Schedule a task to run every second
cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running daily balance update...");

        // Increment balances for all users with a dailyRate
        await AdminUser.update(
            { balance: Sequelize.literal("balance - daily_rate") },
            { where: { dailyRate: { [Sequelize.Op.ne]: null } } }
        );

        console.log("Daily balance update completed.");
    } catch (error) {
        console.error("Error updating balances:", error);
    }
});
