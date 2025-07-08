import * as yup from 'yup';
export function loginSchema(t, isEditMode = false) {
  return yup.object({
    username: yup
      .string()
      .required(t('validation.required', { field: t('login.username') })),
    password: !isEditMode
      ? yup
          .string()
          .required(t('validation.required', { field: t('login.password') }))
          .min(6, t('validation.min', { field: t('login.password'), min: 6 }))
          .max(10, t('validation.max', { field: t('login.password'), max: 10 }))
      : yup.string().nullable(),
  });
}
