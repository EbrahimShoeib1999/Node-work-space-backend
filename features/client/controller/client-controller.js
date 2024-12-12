// ClientController
const ClientService = require("../service/client-service");
const ApiErrorCode = require("../../../core/api-error");
const { clientValidationSchema } = require("../utils/client-validation");

class ClientController {
  async create(req, res) {
    const { error } = clientValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        isSuccessfull: false,
        message: "Validation error",
        error: {
          errorCode: ApiErrorCode.validation,
          message: error.message,
        },
      });
    }

    try {
      const client = await ClientService.createClient(req.body);
      res.status(201).json({
        isSuccessfull: true,
        message: "Client created successfully.",
        data: client,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async getAll(req, res) {
    try {
      const clients = await ClientService.getAllClients();
      res.status(200).json({
        isSuccessfull: true,
        message: "Fetched all clients successfully.",
        data: clients,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const client = await ClientService.getClientById(id);
      if (!client) {
        return res.status(404).json({
          isSuccessfull: false,
          message: "Client not found.",
          error: { errorCode: ApiErrorCode.notFound },
        });
      }
      res.status(200).json({
        isSuccessfull: true,
        message: "Fetched client successfully.",
        data: client,
      });
    } catch (err) {
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await ClientService.deleteClient(id);
      if (!result) {
        return res.status(404).json({
          isSuccessfull: false,
          message: "Client not found.",
          error: { errorCode: ApiErrorCode.notFound },
        });
      }
      res.status(200).json({
        isSuccessfull: true,
        message: "Client deleted successfully.",
      });
    } catch (err) {
      res.status(500).json({
        isSuccessfull: false,
        message: "Server error",
        error: { errorCode: ApiErrorCode.unknownError, message: err.message },
      });
    }
  }
}

module.exports = new ClientController();

// Similar logic can be applied to other models:
// 1. TimerController
// 2. InventoryController
// 3. OrderController
// 4. OrderItemController

// Each controller will follow the same structure with CRUD methods and domain-specific logic as needed.
// If you want the complete implementations for each model, let me know!