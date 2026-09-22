import {
  object,
  string,
  array,
} from 'yup';


export function leaveSchema(
  t,
  multipleLeave
) {
  const leaveDateRequired = t(
    'validation.required',
    {
      field: t(
        'creatLeave.form.leave_date'
      ),
    }
  );

  const durationRequired = t(
    'validation.required',
    {
      field: t(
        'creatLeave.form.duration'
      ),
    }
  );

  return object({
 
    leave_date: multipleLeave
      ? string().nullable()
      : string().required(
          leaveDateRequired
        ),

    multi_date: multipleLeave
      ? array()
          .min(
            1,
            leaveDateRequired
          )
          .required(
            leaveDateRequired
          )
      : array().nullable(),
    duration: string().required(
      durationRequired
    ),

    reason: string().nullable(),
  });
}

export function leaveRecordSchema(t) {
  return object({
    permanent_date: string().required(
      t('validation.required', {
        field: t(
          'creatLeave.form.permanent_date'
        ),
      })
    ),
  });
}


export function otSchema(t) {
  return object({
    ot_date: string().required(
      t('validation.required', {
        field: t(
          'creatLeave.form.ot_date'
        ),
      })
    ),

    ot_time: string().required(
      t('validation.required', {
        field: t(
          'creatLeave.form.ot_time'
        ),
      })
    ),
  });
}
