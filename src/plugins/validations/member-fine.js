import * as yup from 'yup';
export function getMemberFineValidation(t, isEditMode = false) {
  return yup.object({
    staff: yup
          .string()
          .required(
            t('validation.required', { field: t('memberFine.form.name') })
          ),
    date: yup
          .string()
          .required(
            t('validation.required', { field: t('memberFine.form.date') })
          ),
    time: yup
          .string()
          .required(
            t('validation.required', { field: t('memberFine.form.time') })
          )
  })
}