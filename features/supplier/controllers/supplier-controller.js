const SupplierService = require("../services/supplier-service")
const ApiErrorCode = require("../../../core/api-error");
const { supplierValidationSchema,updateSupplierValidationSchema  } = require("../utils/supplier-validation");

class SupplierController {
    // Create a new supplier
    async create(req, res) {
        const { error } = supplierValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Validation error",
                error: {
                    errorCode: ApiErrorCode.validation,
                    message: error.message,
                },
            });
        }

        try {
            const supplier = await SupplierService.createSupplier(req.body);
            res.status(201).json({
                isSuccessful: true,
                message: "Supplier created successfully.",
                data: supplier,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Get all suppliers
    async getAll(req, res) {
        try {
            const {query,page,size} = req.query;
            const suppliers = await SupplierService.getAllSuppliers(query,page,size);
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched all suppliers successfully.",
                data: suppliers,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Get a supplier by ID
    async getById(req, res) {
        const { id } = req.params;
        try {
            const supplier = await SupplierService.findSupplierById(id);
            if (!supplier) {
                return res.status(404).json({
                    isSuccessful: false,
                    message: "Supplier not found.",
                    error: { errorCode: ApiErrorCode.notFound },
                });
            }
            res.status(200).json({
                isSuccessful: true,
                message: "Fetched supplier successfully.",
                data: supplier,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Update a supplier
    async update(req, res) {
        const { id } = req.params;
        const { error } = updateSupplierValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Validation error",
                error: {
                    errorCode: ApiErrorCode.validation,
                    message: error.message,
                },
            });
        }

        try {
            const updatedSupplier = await SupplierService.updateSupplier(id, req.body);
            res.status(200).json({
                isSuccessful: true,
                message: "Supplier updated successfully.",
                data: updatedSupplier,
            });
        } catch (err) {
            res.status(500).json({
                isSuccessful: false,
                message: "Server error",
                error: { errorCode: ApiErrorCode.unknownError, message: err.message },
            });
        }
    }

    // Delete a supplier
    async delete(req, res) {
        const { id } = req.params;
        try {
            const result = await SupplierService.deleteSupplier(id);
            if (!result) {
                return res.status(404).json({
                    isSuccessful: false,
                    message: "Supplier not found.",
                    error: { errorCode: ApiErrorCode.notFound },
                });
            }
            res.status(200).json({
                isSuccessful: true,
                message: "Supplier deleted successfully.",
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

module.exports = new SupplierController();