import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

export const exportExcel = (staff) => {
  XlsxPopulate.fromBlankAsync()
    .then((workbook) => {
      const sheet = workbook.sheet(0);
      const totalRows = 20;
      const header = [
        'NAME',
        'SALARY',
        'LEAVE HOUR',
        'OVER TIME',
        'NET HOUR',
        'LEAVE DAY',
        'GROSS SALARY',
      ];

      header.forEach((title, colIndex) => {
        sheet.cell(3, colIndex + 2).value(title);
      });

      staff.forEach((item, index) => {
        const row = index + 4;

        const { totalHours: leaveHour, totalDays: leaveDay } = calculateHours(
          item?.leave,
          'duration',
          true
        );
        const { totalHours: otHour } = calculateHours(
          item?.over_times,
          'ot_time'
        );
        sheet.cell(`B${row}`).value(item?.eng_name);
        sheet.cell(`C${row}`).value('');
        sheet.cell(`D${row}`).value(leaveHour);
        sheet.cell(`E${row}`).value(otHour);
        sheet.cell(`F${row}`).formula(`ABS(D${row} - E${row})`);
        sheet.cell(`G${row}`).value(leaveDay);

        sheet
          .cell(`H${row}`)
          .formula(
            `IF(C${row}="", "", MROUND(` +
              `IF(D${row}=E${row}, C${row}, ` +
              `IF(D${row}>E${row}, C${row}-((C${row}/22/8)*(D${row}-E${row})), ` +
              `C${row}+((C${row}/22/8)*(E${row}-D${row})*1.5)` +
              `)` +
              `)` +
              `, 100))`
          );
      });

      const columnWidths = {
        1: 15,
        2: 20,
        3: 27,
        4: 12,
        5: 12,
        6: 12,
        7: 12,
        8: 27,
      };
      Object.entries(columnWidths).forEach(([col, width]) => {
        sheet.column(Number(col)).width(width);
      });
      for (let rowNum = 3; rowNum <= staff.length + 3; rowNum++) {
        for (let col = 2; col <= 8; col++) {
          sheet.row(rowNum).cell(col).style({
            border: true,
            fontSize: 10,
          });
        }
      }
      sheet.row(2).height(40);
      sheet.range('A1:Z500').style({ fill: 'FFFFFF' });
      for (let col = 27; col <= 16384; col++) {
        sheet.column(col).hidden(true);
      }
      return workbook.outputAsync();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll_template_${new Date().getFullYear()}_${String(new Date().getMonth() + 1).padStart(2, '0')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(console.error);
};

function calculateHours(records, key, countDays = false) {
  let totalDays = 0;

  const totalHours = (records || []).reduce((acc, item) => {
    const duration = item?.[key] || '';
    let hour = 0;

    if (duration === 'Full Day') {
      hour = 8;
      if (countDays) totalDays += 1;
    } else if (duration === 'Half Day') {
      hour = 4;
      if (countDays) totalDays += 1;
    } else {
      const hourMatch = duration.match(/(\d+)\s*hour/i);
      const minMatch = duration.match(/(\d+)\s*min/i);
      const h = hourMatch ? parseInt(hourMatch[1], 10) : 0;
      const m = minMatch ? parseInt(minMatch[1], 10) : 0;
      hour = h + m / 60;

      if (countDays && hour > 0) totalDays += 1;
    }

    return acc + hour;
  }, 0);

  return { totalHours, totalDays };
}
