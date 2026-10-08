<template>
  <div class="d-flex align-center justify-space-between">
    <div class="d-flex align-center gap-2">
      <BaseTitle>
        {{ isEditMode ? t('addMember.editTitle', 'Edit Member') : t('addMember.title') }}
      </BaseTitle>
      
      <!-- Operational Mode Badge -->
     <!-- <v-chip
  size="small"
  :color="isAdmin ? 'primary' : 'info'"
  variant="tonal"
  class="font-weight-bold text-uppercase"
>
  <v-icon
    start
    :icon="isAdmin ? 'tabler:IconShieldCheck' : 'tabler:IconUserCheck'"
    size="14"
  />
  {{ isAdmin ? t('common.adminView', 'Admin Mode') : t('common.standardView', 'Standard Mode') }}
</v-chip> -->
    </div>
  </div>

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
              :class="{ 'field-disabled': !isAdmin }"
              type="text"
              variant="plain"
              prependIcon="mdi-pound-box"
              :width="'320px'"
              :disabled="!isAdmin"
              :error-messages="errorMessage"
            >
              <template v-if="!isAdmin" #append-inner>
                <v-tooltip text="Only Administrators can edit Staff No" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" icon="tabler:IconLock" size="16" color="grey" />
                  </template>
                </v-tooltip>
              </template>
            </BaseTextField>
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
              :class="{ 'field-disabled': !isAdmin }"
              :items="position"
              prependIcon="mdi-seat"
              item-title="name"
              :width="'320px'"
              item-value="id"
              :disabled="!isAdmin"
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
              :class="{ 'field-disabled': !isAdmin }"
              :items="role"
              prependIcon="mdi-account-supervisor"
              item-title="name"
              :width="'320px'"
              item-value="id"
              :disabled="!isAdmin"
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
              :class="{ 'field-disabled': !isAdmin }"
              type="email"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-email"
              :width="'320px'"
              :disabled="!isAdmin"
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
              :class="{ 'field-disabled': !isAdmin }"
              prependIcon="mdi-calendar-month"
              :width="'320px'"
              :error-messages="errorMessage"
              :disabled="!isAdmin"
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
              :class="{ 'field-disabled': !isAdmin }"
              :items="sortKey"
              prependIcon="mdi-sort"
              :width="'320px'"
              item-title="id"
              item-value="id"
              :error-messages="errorMessage"
              :disabled="!isAdmin"
            >
            </BaseSelect>
          </Field>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <BaseTextField
            v-model="displayedFileName"
            :label="t('addMember.form.staff_image')"
            class="mx-auto"
            prependIcon="tabler:IconPhotoCheck"
            :width="'320px'"
            readonly
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
        </v-col>

          <v-col cols="12" md="6" lg="4">
          <Field name="work_type" v-slot="{ field, errorMessage }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMember.form.work_type')"
              class="mx-auto"
              :class="{ 'field-disabled': !isAdmin }"
              :items="work_type"
              prependIcon="mdi-seat"
              item-title="name"
              :width="'320px'"
              item-value="id"
              :disabled="!isAdmin"
              :error-messages="errorMessage"
            >
            </BaseSelect>
          </Field>
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
import { position, role, sortKey,work_type } from '@/utils/data';
import { useMemberStore } from '@/stores/member/member.js';
import { useI18n } from 'vue-i18n';
import { memberSchema } from '@/plugins/validations/add-member.js';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.js';
import { ref, computed, watch } from 'vue';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const formRef = ref(null);
const isEditMode = ref(false);
const memberCreateSchema = computed(() => memberSchema(t, isEditMode.value));
const memberStore = useMemberStore();
const route = useRoute();
const router = useRouter();
const memberId = route.params.memberId;
const authStore = useAuthStore();
const fileInput = ref(null);
const fileName = ref('');
const selectedFile = ref(null);
const existingFileName = ref(null);
const newImageSelected = ref(false);
const targetMemberRole = ref(null);

const isAdmin = computed(() => {
  const currentRole = authStore.staffRole || localStorage.getItem('staff-role');
  return String(currentRole) === String(ADMIN);
});

const isTargetAdmin = computed(() => String(targetMemberRole.value) === String(ADMIN));

const targetRoleLabel = computed(() => {
  if (targetMemberRole.value === null || targetMemberRole.value === undefined) return '';
  return isTargetAdmin.value ? 'ADMIN' : 'STANDARD';
});

watch(
  () => route.params.memberId,
  async (id) => {
    if (id) {
      isEditMode.value = true;
      const res = await memberStore.fetchMember({
        id: parseInt(id),
        staff_project: {},
      });
      const data = res?.data?.[0];

      if (data) {
        targetMemberRole.value = typeof data.role === 'object' && data.role !== null ? data.role.id : data.role;

        if (data?.staff_image_url && !data.staff_image_url.includes('undefined')) {
          existingFileName.value = data.staff_image_url.split('/').pop();
        } else {
          existingFileName.value = null;
        }

        formRef.value?.setValues({
          eng_name: data.eng_name,
          jp_name: data.jp_name,
          username: data.username,
          password: '',
          staff_no: data.staff_no,
          address: data.address,
          ph_number: data.ph_number,
          position: typeof data.position === 'object' && data.position !== null ? data.position.id : data.position,
          role: targetMemberRole.value,
          email: data.email,
          permanent_date: data.permanent_date,
          ref_person: data.ref_person,
          ref_ph_number: data.ref_ph_number,
          project: data.staff_project?.map((p) => p.project_id) || [],
          sort_key: typeof data.sort_key === 'object' && data.sort_key !== null 
          ? data.sort_key.id 
          : data.sort_key,
          work_type: typeof data.work_type === 'object' && data.work_type !== null ? data.work_type.id : data.work_type,
        });
      }
    } else {
      isEditMode.value = false;
      targetMemberRole.value = null;
      existingFileName.value = null;
      formRef.value?.resetForm();
    }
  },
  { immediate: true }
);

const displayedFileName = computed(() => {
  if (newImageSelected.value && fileName.value) {
    return fileName.value;
  }
  return existingFileName.value || '';
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

    if (key === 'password') {
      if (value && value.trim() !== '') {
        formData.append('password', value);
      }
    } else if (value !== null && value !== undefined && value !== '') {
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
  if (memberId) {
    res = await memberStore.updateMember(formData);
  } else {
    res = await memberStore.createMember(formData);
  }

  if (res?.data?.status === 200) {
    const updatedMember = res.data.staff;
    const loggedInId = localStorage.getItem('staff-id') || authStore.staff?.id;
    if (Number(memberId) === Number(loggedInId) && memberId) {
      const fullImageUrl = `http://localhost:8080/images/staffs/${updatedMember.staff_image}?t=${Date.now()}`;
      sessionStorage.setItem('profileImg', fullImageUrl);
      if (updatedMember.role !== undefined) {
        localStorage.setItem('staff-role', String(updatedMember.role));
      }

      if (Array.isArray(authStore.staff)) {
        const idx = authStore.staff.findIndex((s) => Number(s.id) === Number(updatedMember.id));
        if (idx !== -1) {
          authStore.staff[idx] = { ...authStore.staff[idx], ...updatedMember, staff_image_url: fullImageUrl };
        }
      } else {
        authStore.staff = {
          ...authStore.staff,
          ...updatedMember,
          staff_image_url: fullImageUrl
        };
      }
    }

    router.push({ name: 'member-lists' });
  }
};
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.field-disabled {
  opacity: 0.75;
  cursor: not-allowed;
}
</style>