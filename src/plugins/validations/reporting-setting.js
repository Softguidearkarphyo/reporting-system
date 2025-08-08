import { object, string, mixed, array } from 'yup';

const japaneseCharacter = /^[\u3040-\u30FF\u4E00-\u9FFFー\s]+$/;
const englishCharNum = /^[A-Za-z0-9 ]+$/;

export function getReportingSettingSchema(t, timeSelectionMode) {
  return object({
    day: mixed().test(
      'not-empty',
      t('validation.required', {
        field: t('workHourReport.form.day'),
      }),
      (value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'string') {
          return value.trim() !== '';
        }
        return false;
      }
    ),
    task: string().when('project', {
      is: (value) => !!value,
      then: (schema) =>
        schema.required(
          t('validation.required', { field: t('workHourReport.form.task') })
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    period: !timeSelectionMode
      ? array().min(
          1,
          t('validation.required', { field: t('workHourReport.form.period') })
        )
      : '',
    startTime: timeSelectionMode
      ? string().required(
          t('validation.required', {
            field: t('workHourReport.form.startTime'),
          })
        )
      : '',
    finishTime: timeSelectionMode
      ? string().required(
          t('validation.required', {
            field: t('workHourReport.form.finishTime'),
          })
        )
      : '',
  });
}
