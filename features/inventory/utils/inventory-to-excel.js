const ExcelJS = require("exceljs");
const Inventory = require("../models/inventory");

/**
 * Generates an Excel file with inventory data and sends it as a response.
 */
const exportInventoryToExcel = async (req, res) => {
    try {
        const inventories = await Inventory.findAll();
        const workbook = createExcelWorkbook(inventories);

        // Set response headers
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=inventory.xlsx");

        // Send the Excel file as a response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Creates an Excel workbook with the inventory data.
 * @param {Array} inventories - List of inventory items
 * @returns {ExcelJS.Workbook} - The generated Excel workbook
 */
const createExcelWorkbook = (inventories) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventory");

    // Define headers
    worksheet.columns = getExcelColumns();

    // Add data rows
    inventories.forEach((inventory) => {
        worksheet.addRow(mapInventoryToRow(inventory));
    });

    return workbook;
};

/**
 * Returns column definitions for the Excel sheet.
 * @returns {Array} Column definitions
 */
const getExcelColumns = () => [
    { header: "ID", key: "id", width: 36 },
    { header: "Name", key: "name", width: 20 },
    { header: "Unit Type", key: "unitType", width: 15 },
    { header: "Stock Quantity", key: "stockQuantity", width: 18 },
    { header: "Unit Buying Price", key: "unitBuyingPrice", width: 20 },
    { header: "Total Buying Price", key: "totalBuyingPrice", width: 20 },
    { header: "Selling Price Per Unit", key: "sellingPricePerUnit", width: 20 },
];

/**
 * Maps an inventory object to an Excel row.
 * @param {Object} inventory - Inventory object
 * @returns {Object} Mapped row data
 */
const mapInventoryToRow = (inventory) => ({
    id: inventory.id,
    name: inventory.name,
    unitType: inventory.unitType,
    stockQuantity: inventory.stockQuantity,
    unitBuyingPrice: inventory.unitBuyingPrice,
    totalBuyingPrice: inventory.totalBuyingPrice,
    sellingPricePerUnit: inventory.sellingPricePerUnit,
});

module.exports = { exportInventoryToExcel };
