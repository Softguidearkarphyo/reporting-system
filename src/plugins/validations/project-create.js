import { object, string } from 'yup';

const japaneseCharacter = /^[\u3040-\u30FF\u4E00-\u9FFFー\s]+$/;
const englishCharNum = /^[A-Za-z0-9 ]+$/;

export function getProjectCreateSchema(t, checkPrjCds = []) {
  return object({
    cd: string()
      .required(t('validation.required', { field: t('addProject.form.cd') }))
      .test(
        'unique',
        t('validation.unique', { field: t('addProject.form.cd') }),
        function (value) {
          if (!value) return true;
          return !checkPrjCds?.includes(value);
        }
      ),
    eng_name: string()
      .required(
        t('validation.required', { field: t('addProject.form.eng_name') })
      )
      .matches(
        englishCharNum,
        t('validation.eng_char_num', { field: t('addMember.form.eng_name') })
      ),
    jp_name: string()
      .required(
        t('validation.required', { field: t('addProject.form.jp_name') })
      )
      .matches(
        japaneseCharacter,
        t('validation.jp_character', { field: t('addMember.form.jp_name') })
      ),
  });
}
