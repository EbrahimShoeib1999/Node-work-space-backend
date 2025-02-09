const ExcelJS = require("exceljs");
const Client = require("../models/client");

/**
 * Generates an Excel file with client data and sends it as a response.
 */
const exportClientsToExcel = async (req, res) => {
    try {
        const clients = await Client.findAll();
        const workbook = createExcelWorkbook(clients);

        // Set response headers
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=clients.xlsx");

        // Send the Excel file as a response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Creates an Excel workbook with the client data.
 * @param {Array} clients - List of clients
 * @returns {ExcelJS.Workbook} - The generated Excel workbook
 */
const createExcelWorkbook = (clients) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clients");

    // Define headers
    worksheet.columns = getExcelColumns();

    // Add data rows
    clients.forEach((client) => {
        worksheet.addRow(mapClientToRow(client));
    });

    return workbook;
};

/**
 * Returns column definitions for the Excel sheet.
 * @returns {Array} Column definitions
 */
const getExcelColumns = () => [
    { header: "ID", key: "id", width: 36 },
    { header: "Name", key: "name", width: 25 },
    { header: "Contact Info", key: "contactInfo", width: 30 },
];

/**
 * Maps a client object to an Excel row.
 * @param {Object} client - Client object
 * @returns {Object} Mapped row data
 */
const mapClientToRow = (client) => ({
    id: client.id,
    name: client.name,
    contactInfo: client.contactInfo || "N/A", // Handle null values
});

module.exports = { exportClientsToExcel };
