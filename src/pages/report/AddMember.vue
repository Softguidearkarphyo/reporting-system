<template>
  <BaseTitle> {{ t('addMember.title') }} </BaseTitle>
  <ParentCard class="pa-6">
    <Form
      ref="formRef"
      :validation-schema="memberCreateSchema"
      @submit="submit"
    >
      <v-row class="mx-auto px-4 py-4">
        <v-col cols="12" md="6" lg="4">
          <Field name="eng_name" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.eng_name')"
              class="mx-auto"
              type="text"
              variant="plain"
              prependIcon="mdi-format-letter-case"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="jp_name" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.jp_name')"
              class="mx-auto"
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
        <v-col cols="12" md="6" lg="4">
          <Field name="username" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.username')"
              class="mx-auto"
              type="text"
              variant="plain"
              prependIcon="mdi-account"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="password" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.password')"
              class="mx-auto"
              type="password"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-lock-outline"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="staff_no" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.staff_no')"
              class="mx-auto"
              type="text"
              variant="plain"
              prependIcon="mdi-pound-box"
              :width="'320px'"
              :disabled="roleId === 2"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="address" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.address')"
              class="mx-auto"
              type="text"
              variant="plain"
              prependIcon="mdi-map-marker"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="ph_number" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.ph_number')"
              class="mx-auto"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-phone"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="position" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.position')"
              class="mx-auto"
              :items="position"
              prependIcon="mdi-seat"
              item-title="name"
              :width="'320px'"
              item-value="id"
              :disabled="roleId === 2"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="role" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.role')"
              class="mx-auto"
              :items="role"
              prependIcon="mdi-account-supervisor"
              item-title="name"
              :width="'320px'"
              item-value="id"
              :disabled="roleId === 2"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="email" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.email')"
              class="mx-auto"
              type="email"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-email"
              :width="'320px'"
              :disabled="roleId === 2"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="permanent_date" v-slot="{ field, errorMessage }">
            <BaseDatePicker
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.permanent_date')"
              class="mx-auto"
              prependIcon="mdi-calendar-month"
              :width="'320px'"
              :error-messages="errorMessage"
              :disabled="roleId === 2"
            />
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="ref_person" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.ref_person')"
              class="mx-auto"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account-plus"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="ref_ph_number" v-slot="{ field, errorMessage }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.ref_ph_number')"
              class="mx-auto"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-phone-plus"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="sort_key" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.sort_key')"
              class="mx-auto"
              :items="sortKey"
              prependIcon="mdi-sort"
              :width="'320px'"
              item-title="value"
              item-value="id"
              :error-messages="errorMessage"
              :disabled="roleId === 2"
            >
            </BaseSelect>
          </Field>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <!-- <Field name="fileName" v-slot="{ field, errorMessage }"> -->
          <BaseTextField
            v-model="displayedFileName"
            :label="t('addMember.form.staff_image')"
            class="mx-auto"
            prependIcon="tabler:IconPhotoCheck"
            :width="'320px'"
            :disabled="roleId === 2"
            @click="triggerFileInput"
          >
          </BaseTextField>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            style="display: none"
          />
          <!-- </Field> -->
        </v-col>
        <v-col cols="12">
          <div class="d-flex justify-center">
            <BaseButton type="submit" style="width: 200px">
              {{ t('common.submit') }}
            </BaseButton>
          </div>
        </v-col>
      </v-row>
    </Form>
  </ParentCard>
</template>
<script setup>
import { position, role, sortKey, project } from '@/utils/data';
import { useMemberStore } from '@/stores/member/member.js';
import { useI18n } from 'vue-i18n';
import { memberSchema } from '@/plugins/validations/add-member.js';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.js';

const { t } = useI18n();
const formRef = ref(null);
const isEditMode = ref(false);
const memberCreateSchema = computed(() => memberSchema(t, isEditMode.value));
const memberStore = useMemberStore();
const route = useRoute();
const router = useRouter();
const memberId = route.params.memberId;
const authStore = useAuthStore();
const roleId = computed(() => authStore.staff?.role ?? 0);
const fileInput = ref(null);
const fileName = ref('');
const selectedFile = ref(null);
const existingFileName = ref(null);
const newImageSelected = ref(false);

watch(
  () => route.params.memberId,
  async (val) => {
    if (val) {
      isEditMode.value = true;
      const res = await memberStore.fetchMember({ id: val, staff_project: {} });
      const data = res?.data?.[0];
      existingFileName.value = data?.staff_image_url?.split('/').pop();
      console.log(existingFileName.value, 'hello world');
      formRef.value?.setValues({
        eng_name: data.eng_name,
        jp_name: data.jp_name,
        username: data.username,
        password: '',
        staff_no: data.staff_no,
        address: data.address,
        ph_number: data.ph_number,
        position: data.position,
        role: data.role,
        email: data.email,
        permanent_date: data.permanent_date,
        ref_person: data.ref_person,
        ref_ph_number: data.ref_ph_number,
        project: data.staff_project?.map((p) => p.project_id) || [],
        sort_key: data.sort_key,
      });
    } else {
      isEditMode.value = false;
    }
  },
  { immediate: true }
);
const displayedFileName = computed(() => {
  if (newImageSelected.value && fileName) {
    return fileName.value;
  } else {
    return existingFileName.value;
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    fileName.value = file.name;
    selectedFile.value = file;
    newImageSelected.value = true;
  }
};

const submit = async (values) => {
  const formData = new FormData();
  for (const key in values) {
    const value = values[key];
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value);
    }
  }

  formData.append(
    'staff_image',
    newImageSelected.value && selectedFile.value
      ? selectedFile.value
      : displayedFileName.value
  );

  if (memberId) {
    formData.append('id', memberId);
  }
  let res;
  console.log(formData, 'hello');
  if (memberId) {
    res = await memberStore.updateMember(formData);
  } else {
    res = await memberStore.createMember(formData);
  }

  if (res?.data?.status === 200) {
    const updatedMember = res.data.staff;
    if (Number(memberId) === authStore.loginStaff?.id) {
      authStore.setStaff(updatedMember);
    }
    router.push({ name: 'member-lists' });
  }
};
</script>
