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

export const memberCreateSchema = yup.object({
  eng_name: yup.string().required('English name is required'),
  jp_name: yup.string().required('Japanese name is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6),
  address: yup.string().required('Address is required'),
  ph_number: yup.string().required('Phone number is required'),
  position: yup.string().required('Position is required'),
  role: yup.string().required('Role is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  perment_date: yup
    .string()
    .required('Permanent date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  ref_person: yup.string().nullable(),
  ref_ph_number: yup.string().nullable(),
  project: yup.string().required('Project is required'),
  sort_key: yup.string().required('Sort key is required'),
});
