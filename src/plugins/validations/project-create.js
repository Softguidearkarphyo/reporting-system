import { object, string } from 'yup';

export function getProjectCreateSchema(t) {
  return object({
    code: string().required(
      t('validation.required', { field: t('addProject.form.code') })
    ),
    eng_name: string().required(
      t('validation.required', { field: t('addProject.form.eng_name') })
    ),
    jp_name: string().required(
      t('validation.required', { field: t('addProject.form.jp_name') })
    ),
  });
}
