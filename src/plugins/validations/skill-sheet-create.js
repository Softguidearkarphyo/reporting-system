import * as yup from 'yup';

export function skillSheetSchema(t) {
  return yup.object({
    staff_id: yup
      .string()
      .required(
        t('validation.required', { field: t('addMemberSkill.form.staff') })
      ),

    project: yup
      .array()
      .min(
        1,
        t('validation.required', { field: t('addMemberSkill.form.project') })
      )
      .required(
        t('validation.required', { field: t('addMemberSkill.form.project') })
      ),

    position: yup
      .string()
      .required(
        t('validation.required', { field: t('addMemberSkill.form.position') })
      ),

    grade: yup
      .string()
      .required(
        t('validation.required', { field: t('addMemberSkill.form.grade') })
      ),

    join_date: yup
      .string()
      .required(
        t('validation.required', { field: t('addMemberSkill.form.join_date') })
      ),

    sg_experience: yup.number().nullable(),

    prev_experience: yup.number().nullable(),

    total_experience: yup.number().nullable(),

    japanese_level: yup.string().required(
      t('validation.required', {
        field: t('addMemberSkill.form.japanese_level'),
      })
    ),

    responsibility: yup
      .array()
      .min(
        1,
        t('validation.required', {
          field: t('addMemberSkill.form.responsibility'),
        })
      )
      .required(
        t('validation.required', {
          field: t('addMemberSkill.form.responsibility'),
        })
      ),

    major_tech_stack_id: yup.string().required(
      t('validation.required', {
        field: t('addMemberSkill.form.major_tech_stack'),
      })
    ),
  });
}
