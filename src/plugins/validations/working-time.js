import * as yup from 'yup';
export function dateSchema(t, isEditMode = false) {
  return yup.object({
    start_date: yup
          .string()
          .required(
            t('validation.required', { field: t('workingTime.start_date') })
          ),
    end_date: yup
          .string()
          .required(
            t('validation.required', { field: t('workingTime.end_date') })
          ),
  })
}