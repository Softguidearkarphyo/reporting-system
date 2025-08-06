<template>
  <BaseTitle class="mb-4"> {{ t('addMemberSkill.title') }} </BaseTitle>
  <Form
    ref="formRef"
    :validation-schema="skillSheetCreateSchema"
    @submit="submit"
  >
    <ParentCard class="pa-2">
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <Field name="staff_id" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.staff')"
              class="mx-auto"
              :items="memberList"
              prependIcon="mdi-account"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="project" v-slot="{ field, errorMessage }">
            <BaseMultiSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.project')"
              class="mx-auto"
              :items="projectList"
              prependIcon="mdi-microsoft-teams"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :chip-width="140"
              :error-messages="errorMessage"
            >
            </BaseMultiSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="position" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.position')"
              class="mx-auto"
              :items="positionList"
              prependIcon="mdi-account-supervisor"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="grade" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.grade')"
              class="mx-auto"
              :items="gradeList"
              prependIcon="mdi-star"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="join_date" v-slot="{ field, errorMessage }">
            <BaseDatePicker
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.join_date')"
              class="mx-auto"
              prependIcon="mdi-calendar-month"
              :error-messages="errorMessage"
              :width="'320px'"
            ></BaseDatePicker>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="japanese_level" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.japanese_level')"
              class="mx-auto"
              :items="japaneseLevelList"
              prependIcon="mdi-ideogram-cjk"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="sg_experience" v-slot="{ field }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.sg_experience')"
              class="mx-auto"
              type="number"
              prependIcon="mdi-weather-cloudy-clock"
              :width="'320px'"
            >
            </BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="prev_experience" v-slot="{ field }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.prev_experience')"
              class="mx-auto"
              type="number"
              prependIcon="mdi-history"
              :width="'320px'"
            >
            </BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="total_experience" v-slot="{ field }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.total_experience')"
              class="mx-auto"
              prependIcon="mdi-clock-time-twelve"
              :width="'320px'"
              :readonly="true"
            >
            </BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="responsibility" v-slot="{ field, errorMessage }">
            <BaseMultiSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.responsibility')"
              class="mx-auto"
              :items="responsibilityList"
              prependIcon="mdi-account-check"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :error-messages="errorMessage"
            >
            </BaseMultiSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="major_tech_stack_id" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.major_tech_stack')"
              class="mx-auto"
              :items="techStackList"
              prependIcon="mdi-star-shooting"
              :width="'320px'"
              item-title="name"
              item-value="id"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
      </v-row>
      <div class="mt-4 mb-4">
        <SkillTable
          :proficiencies="fetchedSkillSheet?.tech_stack_proficiencies || []"
          :editable="true"
          @update="handleUpdate"
        />
      </div>
      <div class="d-flex justify-center">
        <BaseButton type="submit" style="width: 200px">
          {{ t('common.submit') }}
        </BaseButton>
      </div>
    </ParentCard>
  </Form>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useMemberStore } from '@/stores/member/member';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useSystemStore } from '@/stores/system/system';
import { useProjectStore } from '@/stores/project/project.js';
import { skillSheetSchema } from '@/plugins/validations/skill-sheet-create';
import { useSkillSheetStore } from '@/stores/skillSheet/skillSheet';
const route = useRoute();
const router = useRouter();
const memberStore = useMemberStore();
const systemStore = useSystemStore();
const projectStore = useProjectStore();
const skillSheetStore = useSkillSheetStore();
const { t } = useI18n();
const formRef = ref(null);
const memberList = ref([]);
const projectList = ref([]);
const positionList = ref([]);
const gradeList = ref([]);
const japaneseLevelList = ref([]);
const responsibilityList = ref([]);
const fetchedSkillSheet = ref(null);
const skillSheetId = route.params.skillSheetId;
const techStackList = ref([]);
const skillSheetCreateSchema = computed(() => skillSheetSchema(t));

watch(
  () => route.params.skillSheetId,
  async (id) => {
    if (!id) return;
    const res = await skillSheetStore.fetchSkillSheet({ id });
    fetchedSkillSheet.value = res?.data?.[0] ?? null;
    await nextTick();
    const data = fetchedSkillSheet.value;
    formRef.value.setValues({
      staff_id: data.staff?.id,
      project: data.staff_project?.map((p) => p.project.id) || [],
      position: data.position?.id,
      grade: data.grade?.id,
      join_date: data.join_date,
      japanese_level: data.japanese_level?.id,
      sg_experience: data.sg_experience,
      prev_experience: data.prev_experience,
      total_experience: data.total_experience,
      responsibility:
        data.staff_responsibility?.map((r) => r.responsibility.id) || [],
      major_tech_stack_id: data.major_tech_stack?.id,
    });
  },
  { immediate: true }
);

const updateTotal = () => {
  const values = formRef.value?.values || {};
  const sg = Number(values.sg_experience || 0);
  const prev = Number(values.prev_experience || 0);
  formRef.value?.setFieldValue('total_experience', sg + prev);
};

watch(() => formRef.value?.values?.sg_experience, updateTotal);
watch(() => formRef.value?.values?.prev_experience, updateTotal);

const fetch = async () => {
  await Promise.all([
    memberStore.fetchMember({ skill_sheet: {} }),
    systemStore.fetchTechStacks(),
    systemStore.fetchResponsibilities(),
    systemStore.fetchGrade(),
    systemStore.fetchPosition(),
    systemStore.fetchJapaneseLevel(),
    projectStore.fetchProject(),
  ]);
  memberList.value =
    (skillSheetId
      ? memberStore.getMembers
      : memberStore.getMembers?.filter((member) => !member.skill_sheet)
    )?.map((item) => ({
      id: item.id,
      name: item.eng_name,
    })) ?? [];

  projectList.value =
    projectStore.getProjects?.map((item) => ({
      id: item.id,
      name: item.eng_name,
    })) ?? [];
  gradeList.value = systemStore.getGrade ?? [];
  positionList.value = systemStore.getPosition ?? [];
  japaneseLevelList.value = systemStore.getJapaneseLevel ?? [];
  responsibilityList.value = systemStore.getResponsibilities ?? [];

  const techStacks = systemStore.getTechStacks;
  if (Array.isArray(techStacks)) {
    techStackList.value = techStacks.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }
};

onMounted(async () => {
  await fetch();
});
const updatedSkills = ref([]);

const handleUpdate = (skills) => {
  updatedSkills.value = skills;
};
const submit = async (values) => {
  const payload = {
    ...values,
    skills:
      updatedSkills.value.length >
      fetchedSkillSheet.value.tech_stack_proficiencies.length
        ? updatedSkills.value
        : fetchedSkillSheet.value.tech_stack_proficiencies,
  };

  let res;
  if (skillSheetId) {
    const payloadd = { ...payload, id: skillSheetId };
    res = await skillSheetStore.updateSkillSheet(payloadd);
  } else {
    res = await skillSheetStore.createSkillSheet(payload);
  }

  if (res?.data?.status === 200) {
    router.push({ name: 'member-skill' });
  }
};
</script>

<style scoped>
.table-center {
  display: table;
  margin: 0 auto;
}
.skill-table td {
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
  padding: 0;
}
.skill-table tbody tr td {
  padding: 8px 4px;
}
</style>
