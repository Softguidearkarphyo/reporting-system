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
