import { object, string, mixed } from 'yup';

const japaneseCharacter = /^[\u3040-\u30FF\u4E00-\u9FFFー\s]+$/;
const englishCharNum = /^[A-Za-z0-9 ]+$/;

export function getReportingSchema(t) {
  return object({
    employee: string().required(
      t('validation.required', { field: t('workHourReport.form.employee') })
    ),
    project: string().required(
      t('validation.required', { field: t('workHourReport.form.project') })
    ),
    task: string().required(
      t('validation.required', { field: t('workHourReport.form.task') })
    ),
    period: mixed().required(
      t('validation.required', { field: t('workHourReport.form.period') })
    ),
    startTime: mixed().required(
      t('validation.required', { field: t('workHourReport.form.startTime') })
    ),
    finishTime: mixed().required(
      t('validation.required', { field: t('workHourReport.form.finishTime') })
    ),
  });
}
