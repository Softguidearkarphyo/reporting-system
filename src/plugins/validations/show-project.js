import { object, string } from 'yup';
export function showProjectSchema(t, checkboxFlg) {
  return object({
    end_date: string().required(
      t('validation.required', { field: t('showProject.end_date') })
    ),
     ...(checkboxFlg.value ? {
        start_date: string().required(
        t('validation.required', { field: t('showProject.start_date') })
      ),
    }
      : {week_date: string().required(
        t('validation.required', { field: t('showProject.week_date') })
      ),
    }
    )
  });
}
