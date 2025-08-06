import { object, string } from 'yup';
export function leaveSchema(t, checkId = []) {
  return object({
    leave_type: string().required(
      t('validation.required', { field: t('creatLeave.form.leave_type') })
    ),
    permanent_date: string()
      .required(
        t('validation.required', { field: t('creatLeave.form.permanent_date') })
      )
      .test(
        'unique',
        t('validation.unique', { field: t('creatLeave.form.permanent_date') }),
        function (value) {
          if (!value) return true;
          return !checkId?.includes(value);
        }
      ),

    reason: string().required(
      t('validation.required', { field: t('creatLeave.form.reason') })
    ),
    ot_date: string().required(
      t('validation.required', { field: t('creatLeave.form.ot_date') })
    ),
    ot_time: string().required(
      t('validation.required', { field: t('creatLeave.form.ot_time') })
    ),
  });
}
