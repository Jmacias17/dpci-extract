import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 📅 getTimestamp
 * Formats the current datetime as `YYYY-MM-DD_HH-MM`
 * for use in the exported file name.
 */
const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
};

/**
 * 📦 exportDPCIsToExcel
 * Creates a styled Excel file where each worksheet represents a page
 * and each row lists the extracted DPCIs with an index.
 *
 * @param {Function} setCurrentStage - Function to update the app stage
 * @param {Array<{page: number, dpciList: string[]}>} dpciResults - Extraction results grouped by page
 */
export const exportDPCIsToExcel = async (setCurrentStage, dpciResults) => {
  // Update stage to indicate conversion is starting
  setCurrentStage('ConvertAck');

  // Initialize workbook metadata
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DPCI Extractor';
  workbook.created = new Date();

  // Create a worksheet per page of results
  dpciResults.forEach(({ page, dpciList }) => {
    const worksheet = workbook.addWorksheet(`Page ${page}`);

    // Define columns: index and DPCI
    worksheet.columns = [
      { header: '#', key: 'index', width: 10 },
      { header: 'DPCI', key: 'dpci', width: 20 },
    ];

    // Fill rows with DPCI data
    dpciList.forEach((dpci, i) => {
      worksheet.addRow({ index: i + 1, dpci });
    });

    // Style header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
  });

  // Export to buffer and trigger download
  const timestamp = getTimestamp();
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `DPCI_Results_${timestamp}.xlsx`);
};
