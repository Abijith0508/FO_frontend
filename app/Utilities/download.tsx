import * as XLSX from 'xlsx';

export function download(tableId : string) {
  const fileName = `${tableId}_table.xlsx`;
  const table = document.getElementById(tableId);
  const workbook = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });

  // Write and trigger file download directly
  XLSX.writeFile(workbook, fileName);
}