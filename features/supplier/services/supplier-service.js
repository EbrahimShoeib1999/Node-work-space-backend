const SupplierRepository = require("../repo/supplier-repo");

class SupplierService {
    // Create a new supplier
    async createSupplier(data) {
        return await SupplierRepository.createSupplier(data);
    }

    // Find a supplier by its ID
    async findSupplierById(id) {
        const supplier = await SupplierRepository.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        return supplier;
    }

    // Get all suppliers with optional filters
    async getAllSuppliers(query,page,size) {
        return await SupplierRepository.findAllSuppliers(query,page,size);
    }

    // Update a supplier's information
    async updateSupplier(id, data) {
        const supplier = await this.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        return await SupplierRepository.updateSupplier(id, data);
    }

    // Delete a supplier by its ID
    async deleteSupplier(id) {
        const supplier = await this.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        return await SupplierRepository.deleteSupplier(id);
    }

    // Update a supplier's balance
    async updateSupplierBalance(id, amount) {
        const supplier = await this.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        return await SupplierRepository.updateSupplierBalance(id, amount);
    }
}

module.exports = new SupplierService();
