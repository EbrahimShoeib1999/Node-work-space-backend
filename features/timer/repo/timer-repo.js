const { Timer } = require("../models/timer");
const {Op, Sequelize} = require("sequelize");
const Client = require('../../client/models/client')

class TimerRepository {
  async findById(timerId) {
    try {
      return await Timer.findByPk(timerId);
    } catch (error) {
      console.error("Error finding timer by ID:", error);
      throw new Error("Failed to retrieve timer.");
    }
  }


  async findAll(query = '', page = 1, size = 10) {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * size;

      // Dynamic search query
      const whereClause = {};

      if (query) {
        const orConditions = [];

        // Check if query is a valid UUID
        if (this.isValidUUID(query)) {
          orConditions.push({ id: query }); // Exact match for UUID
        }

        // Add other searchable fields
        orConditions.push(
            Sequelize.where(
                Sequelize.cast(Sequelize.col('timer_status'), 'TEXT'),
                { [Op.iLike]: `%${query}%` }
            ),
            Sequelize.where(
                Sequelize.cast(Sequelize.col('payment_status'), 'TEXT'),
                { [Op.iLike]: `%${query}%` }
            ),
            { '$Client.name$': { [Op.iLike]: `%${query}%` } } // Correctly reference Client.name
        );

        whereClause[Op.or] = orConditions;
      }

      // Fetch timers with dynamic search, pagination, and include associated Client details
      const timers = await Timer.findAll({
        where: whereClause,
        limit: size, // Number of records per page
        offset, // Skip records for pagination
        include: [
          {
            model: Client, // Ensure the Client model is included
            attributes: ['id', 'name'], // Only include 'id' and 'name' from Client
          },
        ],
      });

      // Get total count of timers that match the query for pagination
      const totalCount = await Timer.count({
        where: whereClause,
        include: [
          {
            model: Client, // Ensure the same include for counting
          },
        ],
      });

      // Calculate total pages for pagination
      const totalPages = Math.ceil(totalCount / size);

      // Return paginated data with dynamic search result
      return {
        data: timers,
        currentPage: parseInt(page, 10) || 1,
        size: parseInt(size, 10) || 10,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.error('Error finding timers with query:', error);
      throw new Error('Failed to retrieve timers.');
    }
  }

  // Helper function to check if a string is a valid UUID
  isValidUUID(value) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  async updateTimer(timerId, updates) {
    try {
      const timer = await Timer.findByPk(timerId);
      if (!timer) {
        throw new Error("Timer not found.");
      }
      await timer.update(updates);
      return timer;
    } catch (error) {
      console.error("Error updating timer:", error);
      throw new Error("Failed to update timer.");
    }
  }

  async updatePaymentStatus(timerId, paymentStatus) {
    try {
      const timer = await Timer.findByPk(timerId);
      if (!timer) {
        throw new Error("Timer not found.");
      }
      await timer.update({ paymentStatus });
      return timer;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Failed to update payment status.");
    }
  }

  async createTimer(data) {
    try {
      return await Timer.create(data);
    } catch (error) {
      console.error("Error creating timer: ", error);
      throw new Error("Failed to create timer: " + error.message);
    }
  }

  async deleteTimer(timerId) {
    try {
      const timer = await Timer.findByPk(timerId);
      if (!timer) {
        throw new Error("Timer not found.");
      }
      await timer.destroy();
      return timer;
    } catch (error) {
      console.error("Error deleting timer:", error);
      throw new Error("Failed to delete timer.");
    }
  }

  async findByClientId(clientId) {
    try {
      return await Timer.findAll({ where: { clientId } });
    } catch (error) {
      console.error("Error finding timers by client ID:", error);
      throw new Error("Failed to retrieve timers for the client.");
    }
  }

  async getActiveTimersCount() {
    try {
      const count = await Timer.count({
        where: {
          timerStatus: "ACTIVE",
        },
      });
      return count;
    } catch (error) {
      console.error("Error fetching active timers count:", error);
      throw new Error("Failed to retrieve active timers count.");
    }
  }

  /**
   * Calculate the growth in the number of timers from the previous month.
   * Includes both active and non-active timers.
   */
  async getTimersStatistics() {
    try {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Count timers for the current month
      const currentMonthCount = await Timer.count({
        where: {
          createdAt: {
            [Op.gte]: startOfCurrentMonth,
          },
        },
      });

      // Count timers for the last month
      const lastMonthCount = await Timer.count({
        where: {
          createdAt: {
            [Op.gte]: startOfLastMonth,
            [Op.lt]: startOfCurrentMonth,
          },
        },
      });

      // Calculate growth rate
      const growthRate =
          lastMonthCount === 0
              ? currentMonthCount > 0
                  ? 100
                  : 0
              : ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;

      return {
        currentMonthCount,
        lastMonthCount,
        percentageGrowth: growthRate.toFixed(2),
      };
    } catch (error) {
      console.error("Error calculating timers growth:", error);
      throw new Error("Failed to calculate timers growth.");
    }
  }


}

module.exports = new TimerRepository();
