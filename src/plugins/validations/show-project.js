import { object, string } from 'yup';

export function showProjectSchema(t, checkboxFlg) {
  return object({
    end_date: string()
      .required(
        t('validation.required', { field: t('showProject.end_date') })
      )
      .test('is-end-of-month', 'End date must be the end of the month', function (end_date) {
        if (!checkboxFlg.value) return true; 
        if (!end_date) return true;
        const endDateObj = new Date(end_date);
        const lastDayObj = new Date(endDateObj.getFullYear(), endDateObj.getMonth() + 1, 0);
        return endDateObj.getDate() === lastDayObj.getDate();
      }),

    ...(checkboxFlg.value
      ? {
          start_date: string()
            .required(
              t('validation.required', { field: t('showProject.start_date') })
            )
            // 1. Ensure start_date is less than end_date
            .test('is-less-than-end', 'Start date must be less than end date', function (startDate) {
              const { end_date } = this.parent;
              if (!startDate || !end_date) return true;
              return new Date(startDate) < new Date(end_date);
            })
            // 2. Ensure start_date is the first day of the month
            .test('is-start-of-month', 'Start date must be the beginning of the month', function (startDate) {
              if (!startDate) return true;
              return new Date(startDate).getDate() === 1;
            }),
        }
      : {
          week_date: string().required(
            t('validation.required', { field: t('showProject.week_date') })
          ),
        }),
  });
}