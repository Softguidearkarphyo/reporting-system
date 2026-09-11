<template>
  <BaseTitle>
    {{ t('addProject.title1') }}
  </BaseTitle>
  <ParentCard>
    <v-row class="align-center">
      <v-col cols="12" md="12">
        <Form
          ref="formRef"
          :validation-schema="projectCreateSchema"
          @submit="submit"
        >
          <div class="d-flex flex-wrap align-center justify-space-around">
            <Field name="cd" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-model="field.value"
                v-bind="field"
                :label="t('addProject.form.cd')"
                type="text"
                variant="plain"
                :width="'300px'"
                prependIcon="mdi-pound-box"
                :error-messages="errorMessage"
                style="flex: none"
              ></BaseTextField>
            </Field>
            <Field name="eng_name" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-model="field.value"
                v-bind="field"
                :label="t('addProject.form.eng_name')"
                type="text"
                variant="plain"
                :width="'300px'"
                prependIcon="mdi-format-letter-case"
                :error-messages="errorMessage"
                style="flex: none"
              ></BaseTextField>
            </Field>
            <Field name="jp_name" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-model="field.value"
                v-bind="field"
                :label="t('addProject.form.jp_name')"
                type="text"
                variant="plain"
                :width="'300px'"
                autocomplete="test"
                prependIcon="mdi-ideogram-cjk"
                :error-messages="errorMessage"
                style="flex: none"
              ></BaseTextField>
            </Field>

            <div class="d-flex ga-2 align-center">
              <BaseButton type="submit" :width="'200px'">
                {{t('common.submit') }}
              </BaseButton>
              <BaseButton
                v-if="isEditMode"
                type="button"
                @click="resetToCreateMode"
              >
                {{ t('common.cancel') }}
              </BaseButton>
            </div>
          </div>
        </Form>
      </v-col>
    </v-row>
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
      <BaseTable :headers="headers" :items="items">
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
              <v-icon icon="tabler:IconEdit" size="15" />
            </BaseButton>
            <BaseButton
              elevation="0"
              @click.stop="showConfirmDelete(item.id)"
              color=""
              class="delete-btn"
              size="small"
            >
              <v-icon icon="tabler:IconTrash" size="15" />
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
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useProjectStore } from '@/stores/project/project.js';
import { getProjectCreateSchema } from '@/plugins/validations/project-create.js';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const authStore = useAuthStore();
const projectStore = useProjectStore();

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

const projectCreateSchema = computed(() =>
  getProjectCreateSchema(t, checkPrjCds.value)
);

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

// Edit Mode မှ Create Mode သို့ Reset ပြုလုပ်ပေးသည့် Helper Function
const resetToCreateMode = () => {
  isEditMode.value = false;
  updateTarget.value = undefined;
  formRef.value?.resetForm();
  checkPrjCds.value = originalItems?.map((prj) => prj.cd) || [];
};

const fetch = async () => {
  // 1. Edit mode များကို reset လုပ်ပါ
  resetToCreateMode();

  // 2. Data များ ပြန်လည် ခေါ်ယူပါ
  await projectStore.fetchProject();
  items.value = [...projectStore.getProjects];
  originalItems = [...items.value];
  checkPrjCds.value = originalItems?.map((prj) => prj.cd) || [];
  hasInitialData.value = originalItems.length > 0;
};

fetch();

const scrollToEdit = async (id) => {
  await projectStore.fetchProject({ id });
  const data = projectStore.getProjects?.[0];
  if (data) {
    isEditMode.value = true;
    updateTarget.value = data.id;
    
    // Edit ပြုလုပ်မည့် Project ၏ Code ကို Duplicate validation မှ ခဏဖယ်ထုတ်ထားမည်
    checkPrjCds.value = originalItems
      ?.filter((prj) => prj.id !== id)
      ?.map((prj) => prj.cd) || [];

    formRef.value?.setValues({
      cd: data.cd,
      eng_name: data.eng_name,
      jp_name: data.jp_name,
    });
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
  if (!deleteTarget.value) return;
  try {
    await projectStore.deleteProject({ id: deleteTarget.value });
    deleteTarget.value = undefined;
    await fetch();
  } catch (error) {
    console.error('Delete Project Error:', error);
  }
};

const submit = async (values, { setErrors }) => {
  try {
    if (isEditMode.value) {
      await projectStore.updateProject({ id: updateTarget.value, ...values });
    } else {
      await projectStore.createProject(values);
    }
    // Submit အောင်မြင်ပါက Form နှင့် Mode များကို Reset ပြုလုပ်ပါမည်
    await fetch();
  } catch (error) {
    // Backend မှ 422 Error ပြန်လာပါက Vee-Validate Error Messages အဖြစ် သတ်မှတ်ပေးပါမည်
    if (error.response?.status === 422 && error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      console.error('Submit Error:', error);
    }
  }
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