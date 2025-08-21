import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

const COL_START = 2;
const ROW_START = 2;
export const exportExcel = (startDate, endDate, data) => {
  XlsxPopulate.fromBlankAsync()
    .then((workbook) => {
      const sheet = workbook.sheet(0);
      const dataRowStart = setupHeaders(sheet);
      const { lastCol, lastRow } = fillData(sheet, data, dataRowStart);
      styleSheet(sheet, lastCol, dataRowStart, lastRow);
      return workbook.outputAsync();
    })
    .then((blob) => downloadBlob(blob, `${startDate}~${endDate} men-hour.xlsx`))
    .catch(console.error);
};

const setupHeaders = (sheet) => {
  const headers = ['作業番', '作業名', '工数', '作業時間', '日数'];
  headers.forEach((header, colIndex) => {
    sheet.cell(ROW_START, COL_START + colIndex).value(header);
  });
  return ROW_START + 1;
};
const fillData = (sheet, data, dataRowStart) => {
  const lastCol = sheet.usedRange().endCell().columnNumber();
  data.forEach((item, rowIndex) => {
    const rowNum = dataRowStart + rowIndex;
    sheet.cell(rowNum, 2).value(item?.cd);
    sheet.cell(rowNum, 3).value(item?.jp_name);
    sheet.cell(rowNum, 4).value(item?.men);
    sheet.cell(rowNum, 5).value(parseFloat(item?.hours));
    sheet.cell(rowNum, 6).value(item?.days);
  });
  const lastRow = dataRowStart + data.length - 1;
  return { lastCol, lastRow };
};

const styleSheet = (sheet, lastCol, dataRowStart, lastRow) => {
  const columnWidths = {
    1: 3,
    2: 30,
    3: 50,
    4: 10,
    5: 10,
    6: 10,
  };
  Object.entries(columnWidths).forEach(([col, width]) => {
    sheet.column(Number(col)).width(width);
  });
  for (let col = COL_START; col <= lastCol; col++) {
    sheet.row(ROW_START).cell(col).style({
      fill: 'EAD1DC',
      border: true,
      fontSize: 10,
    });
  }
  for (let rowNum = dataRowStart; rowNum <= lastRow; rowNum++) {
    for (let col = COL_START; col <= lastCol; col++) {
      sheet
        .row(rowNum)
        .cell(col)
        .style({
          border: true,
          fontSize: col === COL_START ? 12 : 10,
        });
    }
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
