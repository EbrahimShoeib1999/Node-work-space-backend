const DashboardService = require('../service/dashboard-service');
const ApiErrorCode = require("../../../core/api-error");

class DashboardController {

    async getDashboardData(req, res) {
        try {
            const clients = await DashboardService.getDashboardData();
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched all clients successfully.",
                data: clients,
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

module.exports = new DashboardController();