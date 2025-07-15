import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Formats current datetime as YYYY-MM-DD_HH-MM
 */
const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${year}-${month}-${day}_${hours}-${minutes}`;
};

/**
 * Exports DPCI results to a styled Excel file, grouped by page number.
 * @param {Array} dpciResults - Array of { page: number, dpciList: string[] }
 */
export const exportDPCIsToExcel = async (setCurrentStage, dpciResults) => {
  setCurrentStage("ConvertAck");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DPCI Extractor';
  workbook.created = new Date();

  dpciResults.forEach(({ page, dpciList }) => {
    const worksheet = workbook.addWorksheet(`Page ${page}`);

    worksheet.columns = [
      { header: '#', key: 'index', width: 10 },
      { header: 'DPCI', key: 'dpci', width: 20 },
    ];

    dpciList.forEach((dpci, i) => {
      worksheet.addRow({ index: i + 1, dpci });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000000' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
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

  const timestamp = getTimestamp();
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `DPCI_Results_${timestamp}.xlsx`);
};