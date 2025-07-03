// Import yup
import * as yup from 'yup';
// Export reusable schemas
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'At least 6 characters'),
});

export const registerSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export function getMemberCreateSchema(t) {
  return yup.object({
    eng_name: yup
      .string()
      .required(t('validation.required', { field: t('form.eng_name') })),
    jp_name: yup
      .string()
      .required(t('validation.required', { field: t('form.jp_name') })),
    username: yup
      .string()
      .required(t('validation.required', { field: t('form.username') })),
    password: yup
      .string()
      .required(t('validation.required', { field: t('form.password') }))
      .min(6, t('validation.min', { field: t('form.password'), min: 6 })),
    address: yup
      .string()
      .required(t('validation.required', { field: t('form.address') })),
    ph_number: yup
      .string()
      .required(t('validation.required', { field: t('form.ph_number') })),
    position: yup
      .string()
      .required(t('validation.required', { field: t('form.position') })),
    role: yup
      .string()
      .required(t('validation.required', { field: t('form.role') })),
    email: yup
      .string()
      .required(t('validation.required', { field: t('form.email') }))
      .email(t('validation.email', { field: t('form.email') })),
    permanent_date: yup.string().nullable(),
    ref_person: yup.string().nullable(),
    ref_ph_number: yup.string().nullable(),
    project: yup
      .string()
      .required(t('validation.required', { field: t('form.project') })),
    sort_key: yup
      .string()
      .required(t('validation.required', { field: t('form.sort_key') })),
  });
}
