import * as yup from 'yup';
const japaneseCharacter = /^[\u3040-\u30FF\u4E00-\u9FFFー\s]+$/;
export function memberSchema(t, isEditMode = false) {
  return yup.object({
    eng_name: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.eng_name') })
      ),
    jp_name: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.jp_name') })
      )
      .matches(
        japaneseCharacter,
        t('validation.jp_character', { field: t('addMember.form.jp_name') })
      ),
    username: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.username') })
      ),
    password: !isEditMode
      ? yup
          .string()
          .required(
            t('validation.required', { field: t('addMember.form.password') })
          )
          .min(
            6,
            t('validation.min', { field: t('addMember.form.password'), min: 6 })
          )
      : yup.string().nullable(),
    staff_no: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.staff_no') })
      ),
    address: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.address') })
      ),
    ph_number: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.ph_number') })
      )
      .matches(/^\+?\d+$/, 'Phone number must contain digits only'),
    position: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.position') })
      ),
    role: yup
      .string()
      .required(t('validation.required', { field: t('addMember.form.role') })),
    email: yup
      .string()
      .required(t('validation.required', { field: t('addMember.form.email') }))
      .email(t('validation.email', { field: t('addMember.form.email') })),
    permanent_date: yup
      .string()
      .required(
        t('validation.required', { field: t('addMember.form.permanent_date') })
      ),
    ref_person: yup.string().nullable(),
    ref_ph_number: yup.string().nullable(),
    project: yup.array().nullable(),
    sort_key: yup.string().nullable(),
  });
}
