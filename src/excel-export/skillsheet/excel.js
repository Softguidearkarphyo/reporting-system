import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

const COL_MAJOR_TECH = 14;
const COL_JAPANESE = 41;
const COL_CHANGE_DATE = 42;
const COL_START = 14;
export const exportExcel = (skillSheet, skills) => {
  XlsxPopulate.fromBlankAsync()
    .then((workbook) => {
      const sheet = workbook.sheet(0);

      const tableStartRow = setupHeaders(sheet, skills);
      const { dataStartRow, lastCol, lastRow } = fillData(
        sheet,
        skillSheet,
        skills,
        tableStartRow
      );
      styleSheet(sheet, skills, tableStartRow, lastCol, dataStartRow, lastRow);

      return workbook.outputAsync();
    })
    .then((blob) => downloadBlob(blob, 'skillSheet.xlsx'))
    .catch(console.error);
};

const setupHeaders = (sheet, skills) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateHeader = `${year}/${month}`;
  const headerRow1 = [
    '',
    '',
    '',
    '',
    dateHeader,
    '',
    '',
    '入社日',
    'SG経験',
    'SG前経験',
    '合計経験',
    '',
    '',
    'skill',
  ];
  const headerRow2 = [
    '#',
    '氏名',
    '3月末在籍',
    '4月以降在籍',
    '担当業務',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '専任',
    ...skills,
    '日本語',
    '変更日',
  ];
  const sheetData = [headerRow1, headerRow2];
  const titles = [
    '★最も得意',
    '◎：経験5年以上「最も得意」',
    '○：経験3年以上',
    '□：経験1～2年',
    '△：経験がある',
  ];
  const infoText = '専任は業務でよく使うスキルを１つ書く';
  const formattedDateTime = now.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  sheet.cell(5, 13).value(`${formattedDateTime}\t${infoText}`);
  sheet.cell(5, 9).value(year);
  sheet.freezePanes('D8');
  sheet.column('D').hidden(true);
  sheet.column('E').hidden(true);

  titles.forEach((title, i) => {
    sheet
      .cell(i + 1, 3)
      .value(title)
      .style({ fontSize: 10 });
  });

  const tableStartRow = titles.length + 1;
  sheetData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      sheet.cell(tableStartRow + rowIndex, colIndex + 2).value(cell);
    });
  });

  return tableStartRow;
};
const fillData = (sheet, skillSheet, skills, tableStartRow) => {
  const startCol = COL_START;
  const lastCol = sheet.usedRange().endCell().columnNumber();
  const dataStartRow = tableStartRow + 2; // headerRow1 + headerRow2

  skillSheet.forEach((item, rowIndex) => {
    const projects = item?.staff_project
      ?.map((pos) => pos?.project?.jp_name)
      .join(', ');
    const task = item?.staff_responsibility
      ?.map((res) => res?.responsibility?.name)
      .join(', ');
    const joinYear = item?.join_date?.substring(0, 4) || '';
    const rowNum = dataStartRow + rowIndex;

    sheet.cell(rowNum, 1).value('');
    sheet.cell(rowNum, 2).value(item?.id);
    sheet.cell(rowNum, 3).value(item?.staff?.jp_name);
    sheet.cell(rowNum, 6).value(projects);
    sheet.cell(rowNum, 7).value(item?.position?.name);
    sheet.cell(rowNum, 8).value(item?.grade?.name);
    sheet.cell(rowNum, 9).value(joinYear);
    sheet.cell(rowNum, 10).value(item?.sg_experience);
    sheet.cell(rowNum, 11).value(item?.prev_experience);
    sheet.cell(rowNum, 12).value(item?.total_experience);
    sheet.cell(rowNum, 13).value(task);
    sheet.cell(rowNum, COL_MAJOR_TECH).value(item?.major_tech_stack?.name);

    skills.forEach((skillName, skillIndex) => {
      const prof = item.tech_stack_proficiencies?.find(
        (p) => p.tech_stack_name === skillName
      );
      sheet
        .cell(rowNum, startCol + skillIndex + 1)
        .value(prof ? prof.symbol : '')
        .style({ horizontalAlignment: 'center' });
    });

    sheet.cell(rowNum, COL_JAPANESE).value(item?.japanese_level?.name);
    sheet
      .cell(rowNum, COL_CHANGE_DATE)
      .value(formatDateToMonthYear(item?.updated_at, true));
  });

  const lastRow = dataStartRow + skillSheet.length - 1;
  return { dataStartRow, lastCol, lastRow };
};

const styleSheet = (
  sheet,
  skills,
  tableStartRow,
  lastCol,
  dataStartRow,
  lastRow
) => {
  const columnWidths = {
    1: 2.7,
    2: 2.7,
    3: 23,
    4: 15,
    5: 15,
    6: 15,
    7: 4,
    8: 4,
    9: 6,
    10: 6,
    11: 7,
    12: 30,
    13: 30,
    [COL_MAJOR_TECH]: 12,
    [COL_JAPANESE]: 6,
  };
  Object.entries(columnWidths).forEach(([col, width]) => {
    sheet.column(Number(col)).width(width);
  });

  // Skill columns
  const skillStartCol = COL_START + 1;
  for (let i = 0; i < skills.length; i++) {
    sheet.column(skillStartCol + i).width(6.5);
  }

  [tableStartRow, tableStartRow + 1].forEach((rowNum) => {
    for (let col = 2; col <= lastCol; col++) {
      sheet.row(rowNum).cell(col).style({
        fill: 'EAD1DC',
        border: true,
        fontSize: 10,
      });
    }
  });

  sheet
    .range(
      sheet.cell(tableStartRow, COL_START + 1).address() +
        ':' +
        sheet.cell(tableStartRow, lastCol - 1).address()
    )
    .merged(true)
    .value('skill')
    .style({ fill: 'EAD1DC' });

  for (let rowNum = dataStartRow; rowNum <= lastRow; rowNum++) {
    for (let col = 2; col <= lastCol; col++) {
      sheet.row(rowNum).cell(col).style({
        border: true,
        fontSize: 10,
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
const formatDateToMonthYear = (isoDate, padMonth = false) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (isNaN(date)) return '';
  const month = padMonth
    ? String(date.getMonth() + 1).padStart(2, '0')
    : date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}/${year}`;
};
