import { object, string, array } from 'yup';

export function leaveSchema(t, multipleLeave) {
  console.log(multipleLeave);

  return object({
    // leave_date: string().required(
    //   t('validation.required', { field: t('creatLeave.form.leave_date') })
    // ),
    // When not multiple, validate leave_date
    leave_date: multipleLeave
      ? string().nullable()
      : string().required(
          t('validation.required', { field: t('creatLeave.form.leave_date') })
        ),

    // When multiple, validate multi_date
    multi_date: multipleLeave
      ? array()
          .min(
            1,
            t('validation.required', { field: t('creatLeave.form.leave_date') })
          )
          .required(
            t('validation.required', { field: t('creatLeave.form.leave_date') })
          )
      : array().nullable(),

    duration: string().required(
      t('validation.required', { field: t('creatLeave.form.duration') })
    ),
  });
}

export function otSchema(t) {
  return object({
    ot_date: string().required(
      t('validation.required', { field: t('creatLeave.form.ot_date') })
    ),
    ot_time: string().required(
      t('validation.required', { field: t('creatLeave.form.ot_time') })
    ),
  });
}
