import { object, string } from 'yup';

export function getMenPowerSchema(t) {
  return object({
    start_date: string()
      .required(
        t('validation.required', { field: t('menPower.form.startDate') })
      )
      .test(
        'start_before_end',
        t('validation.dateSmallerThanOrEqual', {
          field1: t('menPower.form.startDate'),
          field2: t('menPower.form.endDate'),
        }),
        function (value) {
          const { end_date } = this.parent;
          if (!value || !end_date) return true;
          return new Date(value) <= new Date(end_date);
        }
      ),
    end_date: string()
      .required(t('validation.required', { field: t('menPower.form.endDate') }))
      .test(
        'end_after_start',
        t('validation.dateLargerThanOrEqual', {
          field1: t('menPower.form.endDate'),
          field2: t('menPower.form.startDate'),
        }),
        function (value) {
          const { start_date } = this.parent;
          if (!value || !start_date) return true;
          return new Date(value) >= new Date(start_date);
        }
      ),
  });
}
