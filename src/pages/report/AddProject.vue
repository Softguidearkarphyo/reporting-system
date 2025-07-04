<template>
  <v-container>
    <BaseTitle class="mb-3"> {{ t('addProject.title1') }} </BaseTitle>
    <ParentCard class="pa-6">
      <Form
        ref="formRef"
        :validation-schema="projectCreateSchema"
        @submit="submit"
        v-slot="{ meta }"
      >
        <v-row class="mx-auto px-4 py-4">
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="code" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-model="field.value"
                v-bind="field"
                :label="t('addProject.form.code')"
                type="text"
                variant="plain"
                prependIcon="mdi-pound-box"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="eng_name" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-model="field.value"
                v-bind="field"
                :label="t('addProject.form.eng_name')"
                type="text"
                variant="plain"
                prependIcon="mdi-format-letter-case"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="jp_name" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-model="field.value"
                v-bind="field"
                :label="t('addProject.form.jp_name')"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-ideogram-cjk"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="ml-n2">
            <BaseButton
              :disabled="!meta.valid"
              type="submit"
              style="width: 200px"
            >
              {{ t('common.submit') }}
            </BaseButton>
          </v-col>
        </v-row>
      </Form>
    </ParentCard>

    <div class="d-flex justify-space-between align-center mb-3 mt-10">
      <BaseTitle> {{ t('addProject.title2') }} </BaseTitle>
      <div>
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          variant="underlined"
          color="primary"
          width="300px"
          prepend-icon="mdi-magnify"
        >
        </BaseTextField>
      </div>
    </div>
    <v-card>
      <BaseTable
        :headers="headers"
        :items="items"
        :height="windowHeight"
        :items-count="itemsCount"
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
              @click.stop="pushToEdit(item.id)"
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
    </v-card>
  </v-container>
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
const projectCreateSchema = computed(() => getProjectCreateSchema(t));
const role = authStore.staffRole;
const formRef = ref(null);
const search = ref('');
const items = ref([]);
let originalItems = [];
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('addProject.table.code'),
      key: 'code',
    },
    {
      title: t('addProject.table.name'),
      key: isJapanese ? 'jp_name' : 'eng_name',
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
  await projectStore.fetchProject();
  items.value = [...projectStore.getProjects];
  originalItems = [...items.value];
};

fetch();

const submit = async (values) => {
  console.log('Form submitted:', values);
  await projectStore.createProject(values);
  formRef.value?.resetForm();
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
</script>
