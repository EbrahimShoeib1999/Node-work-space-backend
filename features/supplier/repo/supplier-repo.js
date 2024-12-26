const Supplier = require("../models/supplier");

class SupplierRepository {
    // Create a new supplier
    async createSupplier(data) {
        return await Supplier.create(data);
    }

    // Find a supplier by its ID
    async findSupplierById(id) {
        return await Supplier.findByPk(id);
    }

    // Find all suppliers with optional filters
    async findAllSuppliers(filters = {}) {
        return await Supplier.findAll({
            where: filters,
        });
    }

    // Update a supplier's information by its ID
    async updateSupplier(id, data) {
        const supplier = await this.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        return await supplier.update(data);
    }

    // Delete a supplier by its ID
    async deleteSupplier(id) {
        const supplier = await this.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        return await supplier.destroy();
    }

    // Update the balance of a supplier
    async updateSupplierBalance(id, amount) {
        const supplier = await this.findSupplierById(id);
        if (!supplier) {
            throw new Error(`Supplier not found with ID: ${id}`);
        }
        const newBalance = parseFloat(supplier.balance) + parseFloat(amount);
        return await supplier.update({ balance: newBalance });
    }
}

module.exports = new SupplierRepository();
