import { object, number, string } from 'yup';

export function getLocationSchema(t) {
  return object({
    staff_id: number().required(t('validation.required', { field: t('location.form.staff') })),
    lat: number().typeError(t('validation.numeric')).required(t('validation.required', { field: t('location.form.lat') })),
    lon: number().typeError(t('validation.numeric')).required(t('validation.required', { field: t('location.form.lon') })),
    allow_meter: number().typeError(t('validation.numeric')).required(t('validation.required', { field: t('location.form.allow_meter') })),
    device_uuid: string().nullable(),
  });
}