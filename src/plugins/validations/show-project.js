import { object, string } from 'yup';
export function showProjectSchema(t) {
  return object({
    end_date: string().required(
      t('validation.required', { field: t('showProject.end_date') })
    ),
    week_date: string().required(
      t('validation.required', { field: t('showProject.week_date') })
    ),
  });
}
