import { object, number, string } from 'yup';

export function getRemoteLocationSchema(t) {
  return object({
    staff_id: number().required(t('validation.required', { field: t('remoteLocation.form.staff') })),
    lat: number().typeError(t('validation.numeric')).required(t('validation.required', { field: t('remoteLocation.form.lat') })),
    lon: number().typeError(t('validation.numeric')).required(t('validation.required', { field: t('remoteLocation.form.lon') })),
    allow_meter: number().typeError(t('validation.numeric')).required(t('validation.required', { field: t('remoteLocation.form.allow_meter') })),
    device_uuid: string().nullable(),
  });
}