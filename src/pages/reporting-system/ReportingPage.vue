<template>
  <v-container>
    <BaseTitle class="mb-3">
      {{ t('workHourReport.title') }}
    </BaseTitle>
    <ParentCard class="pa-2">
      <Form ref="formRef" :validation-schema="reportingSchema" @submit="submit">
        <v-row>
          <v-col cols="3">
            <v-date-picker
              v-model="dates"
              class="mx-auto"
              rounded="lg"
              hide-header
              multiple
            >
            </v-date-picker>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-col cols="12">
                <Field name="employee" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.employee')"
                    :items="employees"
                    prependIcon="mdi-account"
                    variant="underlined"
                    item-title="name"
                    item-value="id"
                    width="415px"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Field name="project" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.project')"
                    :items="projects"
                    prependIcon="mdi-microsoft-teams"
                    variant="underlined"
                    item-title="name"
                    item-value="id"
                    width="415px"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Field name="task" v-slot="{ field, errorMessage }">
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    :label="t('workHourReport.form.task')"
                    :items="tasks"
                    prependIcon="mdi-clipboard-text"
                    variant="underlined"
                    item-title="name"
                    width="415px"
                    item-value="id"
                    :error-messages="errorMessage"
                  >
                  </BaseSelect>
                </Field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-col cols="12">
                    <Field
                      name="timeSelectionMode"
                      rules=""
                      v-slot="{ errorMessage }"
                    >
                      <v-radio-group
                        v-model="timeSelectionMode"
                        inline
                        class="mt-2 ml-n2"
                        :error-messages="errorMessage"
                      >
                        <v-radio
                          :label="t('workHourReport.form.auto')"
                          :value="0"
                          color="primary"
                          class="radio-btn mr-5"
                        ></v-radio>
                        <v-radio
                          :label="t('workHourReport.form.manual')"
                          :value="1"
                          color="primary"
                          class="radio-btn"
                        ></v-radio>
                      </v-radio-group>
                    </Field>
                  </v-col>
                </v-row>
                <v-row
                  v-if="timeSelectionMode === 0"
                  style="margin-bottom: -32px"
                >
                  <v-col cols="12">
                    <Field name="period" v-slot="{ field, errorMessage }">
                      <BaseMultiSelect
                        v-model="field.value"
                        v-bind="field"
                        :label="t('workHourReport.form.period')"
                        :items="periods"
                        prependIcon="mdi-clock"
                        variant="underlined"
                        item-title="name"
                        width="100%"
                        item-value="id"
                        :error-messages="errorMessage"
                      >
                      </BaseMultiSelect>
                    </Field>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="6">
                    <Field name="startTime" v-slot="{ field, errorMessage }">
                      <BaseSelect
                        v-model="field.value"
                        v-bind="field"
                        :label="t('workHourReport.form.startTime')"
                        :items="timeSlots"
                        prependIcon="mdi-clock-time-nine"
                        item-title="name"
                        item-value="name"
                        max-width="155px"
                        variant="underlined"
                        :error-messages="errorMessage"
                      >
                      </BaseSelect>
                    </Field>
                  </v-col>
                  <v-col cols="6">
                    <Field name="finishTime" v-slot="{ field, errorMessage }">
                      <BaseSelect
                        v-model="field.value"
                        v-bind="field"
                        :label="t('workHourReport.form.finishTime')"
                        :items="timeSlots"
                        item-title="name"
                        item-value="name"
                        max-width="160px"
                        class="ml-n3"
                        variant="underlined"
                        :error-messages="errorMessage"
                      >
                      </BaseSelect>
                    </Field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div class="ml-n2">
                      <BaseButton type="submit" style="width: 310px">
                        {{ t('common.submit') }}
                      </BaseButton>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-col cols="12">
                  <div class="mt-n2">
                    <BaseButton
                      type="submit"
                      style="width: 310px"
                      class="rounded-pill"
                    >
                      {{ t('common.saveSetting') }}
                    </BaseButton>
                  </div>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </Form>
    </ParentCard>

    <ParentCard>
      <BaseTable
        :headers="headers"
        :items="[]"
        :items-count="itemsCount"
        :style="{ minHeight: windowHeight }"
        :pagination="false"
      >
        <template #item.position="{ item }">
          <div
            class="rounded-pill py-1 px-1 text-center mx-auto"
            :style="{
              backgroundColor: item.position?.color,
              width: '75px',
              fontSize: '11px',
            }"
          >
            {{ item.position?.name }}
          </div>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex justify-end">
            <BaseButton
              elevation="0"
              @click.stop="scrollToEdit(item.id)"
              color=""
              class="edit-btn"
              size="small"
            >
              <v-icon> mdi-pencil </v-icon>
            </BaseButton>
            <BaseButton
              elevation="0"
              @click.stop="showConfirmDelete(item.id)"
              color=""
              class="delete-btn"
              size="small"
            >
              <v-icon> mdi-trash-can</v-icon>
            </BaseButton>
          </div>
        </template>
      </BaseTable>
    </ParentCard>

    <BaseConfirmDelete
      v-model="confirmDelete"
      :text="t('addProject.deleteConfirmText')"
      :class="{ 'd-none': !confirmDelete }"
      @yes="
        confirmDelete = false;
        deleteProject();
      "
      @no="
        confirmDelete = false;
        deleteTarget = undefined;
      "
    ></BaseConfirmDelete>
  </v-container>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useReportingStore } from '@/stores/reporting/reporting.js';
import { getReportingSchema } from '@/plugins/validations/reporting.js';
import { ADMIN } from '@/utils/constant';
import { timeSlots, periods } from '@/utils/data';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const reportingStore = useReportingStore();
const reportingSchema = computed(() => getReportingSchema(t));
const role = authStore.staffRole;
const formRef = ref(null);
const timeSelectionMode = ref(0);
const dates = ref([]);
const isEditMode = ref(false);
const search = ref('');
const confirmDelete = ref(false);
const deleteTarget = ref(undefined);
const updateTarget = ref(undefined);
const checkPrjCds = ref([]);
let originalItems = [];
const employeeItems = ref([]);
const employees = computed(() => {
  return employeeItems.value?.map((item) => ({
    ...item,
    name: `${isJapanese.value ? item.jp_name : item.eng_name}`,
  }));
});
const isJapanese = computed(() => locale.value === 'ja');
const projectItems = ref([]);
const projects = computed(() => {
  return projectItems.value?.map((item) => ({
    ...item,
    name: `${item.cd} : ${isJapanese.value ? item.jp_name : item.eng_name}`,
  }));
});
const taskItems = ref([]);
const tasks = computed(() => {
  return taskItems.value?.map((item) => ({
    ...item,
    name: `${item.cd} : ${isJapanese.value ? item.jp_name : item.eng_name}`,
  }));
});
const headers = computed(() => {
  const tmpHeaders = [
    {
      title: t('addProject.table.cd'),
      key: 'cd',
    },
    {
      title: t('addProject.table.name'),
      key: isJapanese.value ? 'jp_name' : 'eng_name',
      sortable: false,
    },
  ];
  if (role === ADMIN) {
    tmpHeaders.push({
      title: t('memberList.table.action'),
      key: 'action',
      align: 'center',
      sortable: false,
      width: '10%',
    });
  }
  return tmpHeaders;
});
let windowHeight, itemsCount;
if (window.innerWidth > 1366) {
  windowHeight = window.innerHeight / 1.4;
  itemsCount = 10;
} else {
  windowHeight = window.innerHeight / 1.8;
  itemsCount = 5;
}

const fetch = async () => {
  formRef.value?.resetForm();
  await reportingStore.fetchProject();
  projectItems.value = [...reportingStore.getProjects];
  await reportingStore.fetchMember();
  const tmpMembers = [...reportingStore.getMembers];
  tmpMembers?.sort((a, b) => {
    if (!a.sort_key) return 1;
    if (!b.sort_key) return -1;
    return a.sort_key - b.sort_key;
  });
  employeeItems.value = [...tmpMembers];
  await reportingStore.fetchTask();
  taskItems.value = [...reportingStore.getTasks];
};

fetch();

const scrollToEdit = async (id) => {
  await projectStore.fetchProject({ id });
  const data = projectStore.getProjects?.[0];
  isEditMode.value = true;
  if (data) {
    checkPrjCds.value = originalItems
      ?.filter((prj) => prj.id !== id)
      ?.map((prj) => prj.cd);
    formRef.value?.setValues({
      cd: data.cd,
      eng_name: data.eng_name,
      jp_name: data.jp_name,
    });
    updateTarget.value = data.id;
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};
const deleteProject = async () => {
  await projectStore.deleteProject({ id: deleteTarget.value });
  deleteTarget.value = undefined;
  fetch();
};
const submit = async (values) => {
  if (isEditMode.value) {
    await projectStore.updateProject({ id: updateTarget.value, ...values });
  } else {
    await projectStore.createProject(values);
  }
  fetch();
};
</script>

<style>
.radio-btn .mdi-radiobox-blank {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
