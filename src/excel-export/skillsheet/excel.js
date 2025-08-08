import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

export const exportExcel = (skillSheet, skills) => {
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
  XlsxPopulate.fromBlankAsync()
    .then((workbook) => {
      const sheet = workbook.sheet(0);
      const now = new Date();
      const formattedDateTime = now.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const text = '専任は業務でよく使うスキルを１つ書く';

      sheet.cell(5, 13).value(`${formattedDateTime}\t${text}`);
      const currentYear = new Date().getFullYear();
      sheet.cell(5, 9).value(currentYear);
      sheet.freezePanes('D8');
      sheet.column('D').hidden(true);
      sheet.column('E').hidden(true);
      titles.forEach((title, index) => {
        sheet
          .cell(index + 1, 3)
          .value(title)
          .style({ fontSize: 10 });
      });
      const tableStartRow = titles.length + 1;
      sheetData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          sheet.cell(tableStartRow + rowIndex, colIndex + 2).value(cell);
        });
      });

      const lastCol = sheet.usedRange().endCell().columnNumber();
      const startCol = 14;
      const dataStartRow = tableStartRow + sheetData.length;
      skillSheet.forEach((item, rowIndex) => {
        const projects = item?.staff_project
          ?.map((pos) => pos?.project?.jp_name)
          .join(', ');
        const task = item?.staff_responsibility
          ?.map((res) => res?.responsibility?.name)
          .join(', ');
        const year = item?.join_date?.substring(0, 4) || '';
        const rowNum = dataStartRow + rowIndex;
        sheet.cell(rowNum, 1).value('');
        sheet.cell(rowNum, 2).value(item?.id);
        sheet.cell(rowNum, 3).value(item?.staff?.jp_name);
        sheet.cell(rowNum, 6).value(projects);
        sheet.cell(rowNum, 7).value(item?.position?.name);
        sheet.cell(rowNum, 8).value(item?.grade?.name);
        sheet.cell(rowNum, 9).value(year);
        sheet.cell(rowNum, 10).value(item?.sg_experience);
        sheet.cell(rowNum, 11).value(item?.prev_experience);
        sheet.cell(rowNum, 12).value(item?.total_experience);
        sheet.cell(rowNum, 13).value(task);
        sheet.cell(rowNum, 14).value(item?.major_tech_stack?.name);
        skills.forEach((skillName, skillIndex) => {
          const prof = item.tech_stack_proficiencies.find(
            (p) => p.tech_stack_name === skillName
          );
          sheet
            .cell(rowNum, startCol + skillIndex + 1)
            .value(prof ? prof.symbol : '')
            .style({ horizontalAlignment: 'center' });
        });
        sheet.cell(rowNum, 41).value(item?.japanese_level?.name);
        sheet
          .cell(rowNum, 42)
          .value(formatDateToMonthYear(item?.updated_at, true));
      });
      sheet.column(1).width(2.7);
      sheet.column(2).width(2.7);
      sheet.column(3).width(23);
      sheet.column(4).width(15);
      sheet.column(5).width(15);
      sheet.column(6).width(15);
      sheet.column(7).width(4);
      sheet.column(8).width(4);
      sheet.column(9).width(6);
      sheet.column(10).width(6);
      sheet.column(11).width(7);
      sheet.column(12).width(30);
      sheet.column(13).width(30);
      sheet.column(14).width(12);
      sheet.column(41).width(6);
      const skillStartCol = startCol + 1;
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
          sheet.cell(tableStartRow, startCol + 1).address() +
            ':' +
            sheet.cell(tableStartRow, lastCol - 1).address()
        )
        .merged(true)
        .value('skill')
        .style({ fill: 'EAD1DC' });
      const lastRow = dataStartRow + skillSheet.length - 1;
      for (let rowNum = dataStartRow; rowNum <= lastRow; rowNum++) {
        for (let col = 2; col <= lastCol; col++) {
          sheet.row(rowNum).cell(col).style({
            border: true,
            fontSize: 10,
          });
        }
      }
      return workbook.outputAsync();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skillSheet.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
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
