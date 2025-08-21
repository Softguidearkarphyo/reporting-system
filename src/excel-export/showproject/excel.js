import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
const COL_START = 2;
const HEADER_ROW = 3;


export const excelExport = (items, { t, locale }, checkboxFlg) => {
  XlsxPopulate.fromBlankAsync().then((workbook) => {
    if(checkboxFlg == true){
      const plainItems = toRaw(items)
      plainItems.forEach((item, index) => {
        let sheet = index == 0 ?  workbook.sheet(index) : workbook.addSheet(`Sheet ${index + 1}`);
        fillDataMonth(item, sheet,{ t, locale })
      }); 
    } else {
    // Fill in data
     let sheet = workbook.sheet(0);
    fillData(items, sheet,{ t, locale })
    }
    // Export file
    downloadFile(workbook, { t, locale })
  });
};


const downloadFile = (workbook, { t, locale })=>{
    workbook.outputAsync().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${t('showProject.title')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
}

const fillData = (items, sheet, { t, locale }) => {
  let currentRow = HEADER_ROW;
  const isEnglish = locale == 'en';

  for (let c = COL_START + 25; c <= 16384; c++) {
  sheet.column(c).hidden(true)
  }

  sheet.range(sheet.cell(1, COL_START-1),  sheet.cell(1000, items.length*10))
  .style({ fill: 'FFFFFF', border: false });

  sheet.cell("A1").value('作業実績_全員工数').style({
    bold: true,
    fontSize: 14,        
  })
  
  items.forEach((week) => {
    sheet.cell(currentRow, COL_START)
      .value(week.weekLabel)
      .style({
        bold: true,
        fontSize: 14,          
        border: false,         
        fill: null         
      });
    currentRow++;
    currentRow++;

    week.projects.forEach((project) => {
      sheet.cell(currentRow, COL_START)
        .value(isEnglish ? project.project_eng : project.project_jp)
        .style({
          bold: true,
          fontSize: 11,        
          border: false,       
          fill: null,
        });
      currentRow++;

      // Table headers
      const COLUMNS = [
        t('common.no'),
        t('workingTime.staffName'),
        t('workingTime.workingHours')
      ];

      COLUMNS.forEach((title, index) => {
        sheet.cell(currentRow, COL_START + index)
          .value(title)
          .style({
            bold: true,
            fill: '1B5E20', 
            horizontalAlignment: 'center',
            fontColor: 'FFFFFF',
            border: {
              top: true, bottom: true, left: true, right: true
            }
          });
      });

      sheet.column(COL_START).width(6)  
      sheet.column(COL_START + 1).width(30)
      sheet.column(COL_START + 2).width(20)


      currentRow++;

      project.project_info.forEach((staff, idx) => {
        sheet.cell(currentRow, COL_START)
          .value(idx + 1)
          .style({
            border: true,
            horizontalAlignment: 'center'
          });
        sheet.cell(currentRow, COL_START + 1)
          .value(isEnglish ? staff.eng_name : staff.jp_name)
          .style({
            border: true
          });

        sheet.cell(currentRow, COL_START + 2)
          .value(staff.periods[0]+t('workingTime.hour') +(staff.periods[1] == 5 ? ' 30 ' +  t('workingTime.minutes') : ''))
          .style({
            border: true,
            horizontalAlignment: 'center'
          });
        currentRow++;
      });
      currentRow++;
    });
    currentRow++; 
  });
};

const fillDataMonth = (item, sheet, { t, locale }) => {
  let currentRow = HEADER_ROW;
  const isEnglish = locale == 'en';

  for (let c = COL_START + 25; c <= 16384; c++) {
  sheet.column(c).hidden(true)
  }
  
   sheet.range(sheet.cell(1, 1), sheet.cell(currentRow + 100, COL_START + 30))
    .style({ fill: 'FFFFFF'});

  sheet.cell("A1").value('作業実績_全員工数').style({
    bold: true,
    fontSize: 14,        
  })
  // Use the object directly
  sheet.cell(currentRow, COL_START)
    .value(item.weekLabel)
    .style({
      bold: true,
      fontSize: 14,
    });

  currentRow += 2;

  item.projects.forEach((project) => {
    sheet.cell(currentRow, COL_START)
      .value(isEnglish ? project.project_eng : project.project_jp)
      .style({
        bold: true,
        fontSize: 11,
        border: false,
        fill: null
      });

    currentRow++;

    // Table headers
    const COLUMNS = [
      t('common.no'),
      t('workingTime.staffName'),
      t('workingTime.workingHours')
    ];

    COLUMNS.forEach((title, index) => {
      sheet.cell(currentRow, COL_START + index)
        .value(title)
        .style({
          bold: true,
          fill: '1B5E20', 
          horizontalAlignment: 'center',
          fontColor: 'FFFFFF',
          border: {
            top: true, bottom: true, left: true, right: true
          }
        });
    });

    sheet.column(COL_START).width(6);
    sheet.column(COL_START + 1).width(30);
    sheet.column(COL_START + 2).width(20);

    currentRow++;

    project.project_info.forEach((staff, idx) => {
      sheet.cell(currentRow, COL_START)
        .value(idx + 1)
        .style({ border: true, horizontalAlignment: 'center' });

      sheet.cell(currentRow, COL_START + 1)
        .value(isEnglish ? staff.eng_name : staff.jp_name)
        .style({ border: true });

      sheet.cell(currentRow, COL_START + 2)
        .value(staff.periods[0] + t('workingTime.hour') +
               (staff.periods[1] == 5 ? ' 30 ' + t('workingTime.minutes') : ''))
        .style({ border: true, horizontalAlignment: 'center' });

      currentRow++;
    });

    currentRow++;
  });
  
};





