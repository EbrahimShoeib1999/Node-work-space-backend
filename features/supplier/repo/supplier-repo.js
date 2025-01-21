const Supplier = require("../models/supplier");
const {Op} = require("sequelize");
const Inventory = require("../../inventory/models/inventory");

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
    async findAllSuppliers(query = '', page = 1, size = 10) {
    try {
        // Calculate offset for pagination
        const offset = (page - 1) * size;

        // Dynamic search query
        const whereClause = {};
        if (query) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${query}%` } },  // Search by supplier name
                { responsibleName: { [Op.iLike]: `%${query}%` } },  // Search by responsible person name
                { phone: { [Op.iLike]: `%${query}%` } },  // Search by supplier phone
                { email: { [Op.iLike]: `%${query}%` } },  // Search by supplier email
                { niche: { [Op.iLike]: `%${query}%` } },  // Search by supplier niche
            ];
        }

        // Fetch suppliers with dynamic search, pagination
        const suppliers = await Supplier.findAll({
            where: whereClause,
            limit: size,  // Number of records per page
            offset,        // Skip records for pagination
            // include: [
            //     {
            //         model: Inventory,  // Include Inventory model to fetch related inventory details
            //         as: 'inventoryItems',  // Alias used in Supplier-Inventory association
            //     }
            // ],
        });

        // Get total count of suppliers that match the query for pagination
        const totalCount = await Supplier.count({ where: whereClause });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / size);

        // Return paginated data with dynamic search result
        return {
            data: suppliers,
            currentPage: parseInt(page) || 1,
            size: parseInt(size) || 10,
            totalCount,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw new Error("Failed to fetch suppliers.");
    }
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
