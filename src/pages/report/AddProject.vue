<template>
  <BaseTitle>
    {{ t('addProject.title1') }}
  </BaseTitle>
  <ParentCard class="pa-2">
    <Form
      ref="formRef"
      :validation-schema="projectCreateSchema"
      @submit="submit"
    >
      <v-row class="align-center justify-center" no-gutters>
        <v-col cols="12" md="6" lg="3" class="px-3">
          <Field name="cd" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addProject.form.cd')"
              type="text"
              variant="plain"
              width="90%"
              prependIcon="mdi-pound-box"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="px-3">
          <Field name="eng_name" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addProject.form.eng_name')"
              type="text"
              variant="plain"
              width="90%"
              prependIcon="mdi-format-letter-case"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="3" class="px-3">
          <Field name="jp_name" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addProject.form.jp_name')"
              type="text"
              variant="plain"
              width="90%"
              autocomplete="test"
              prependIcon="mdi-ideogram-cjk"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <div class="d-flex justify-start mx-3">
            <BaseButton type="submit" style="width: 200px">
              {{ t('common.submit') }}
            </BaseButton>
          </div>
        </v-col>
      </v-row>
    </Form>
  </ParentCard>
  <div v-if="hasInitialData">
    <v-row class="align-center mt-3">
      <v-col cols="6" md="7" lg="9" class="d-flex justify-start">
        <BaseTitle> {{ t('addProject.title2') }} </BaseTitle>
      </v-col>
      <v-col cols="6" md="5" lg="3" class="d-flex justify-end">
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          color="primary"
          prepend-icon="mdi-magnify"
        >
        </BaseTextField>
      </v-col>
    </v-row>
    <ParentCard>
      <BaseTable
        :headers="headers"
        :items="items"
        :items-count="itemsCount"
        :style="{ minHeight: windowHeight }"
      >
        <template #[`item.position`]="{ item }">
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
        <template #[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-end">
            <BaseButton
              elevation="0"
              @click.stop="scrollToEdit(item.id)"
              color=""
              class="edit-btn"
              size="small"
            >
              <v-icon icon="tabler:IconEdit" size="18" color="primary" />
            </BaseButton>
            <BaseButton
              elevation="0"
              @click.stop="showConfirmDelete(item.id)"
              color=""
              class="delete-btn"
              size="small"
            >
              <v-icon
                icon="tabler:IconTrash"
                size="18"
                style="color: #ff0000"
              />
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
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useProjectStore } from '@/stores/project/project.js';
import { getProjectCreateSchema } from '@/plugins/validations/project-create.js';
import { ADMIN } from '@/utils/constant';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const projectCreateSchema = computed(() =>
  getProjectCreateSchema(t, checkPrjCds.value)
);
const role = authStore.staffRole;
const formRef = ref(null);
const isEditMode = ref(false);
const search = ref('');
const confirmDelete = ref(false);
const deleteTarget = ref(undefined);
const updateTarget = ref(undefined);
const checkPrjCds = ref([]);
let originalItems = [];
const items = ref([]);
const hasInitialData = ref(false);
const headers = computed(() => {
  const tmpHeaders = [
    {
      title: t('addProject.table.cd'),
      key: 'cd',
    },
    {
      title: t('addProject.table.english_name'),
      key: 'eng_name',
      sortable: false,
    },
    {
      title: t('addProject.table.japanese_name'),
      key: 'jp_name',
      sortable: false,
    },
    {
      title: t('addProject.table.created_at'),
      key: 'created_at',
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
  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title.toUpperCase(),
  }));
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
  await projectStore.fetchProject();
  items.value = [...projectStore.getProjects];
  originalItems = [...items.value];
  checkPrjCds.value = originalItems?.map((prj) => prj.cd);
  hasInitialData.value = originalItems.length > 0;
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

watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      items.value = originalItems.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(newVal.toLowerCase())
        )
      );
    } else {
      items.value = [...originalItems];
    }
  }
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};
</script>
