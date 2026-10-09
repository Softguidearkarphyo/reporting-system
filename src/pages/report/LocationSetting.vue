<template>
  <BaseTitle class="mb-3">
    {{ t('location.title1') }}
  </BaseTitle>

  <ParentCard>
    <Form ref="formRef" :validation-schema="locationSchema" @submit="submit">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4" lg="2">
          <Field name="staff_id" v-slot="{ field, errorMessage }">
            <v-select v-model="field.value" v-bind="field" :items="staffOptions" item-title="label" item-value="id"
              :label="t('location.form.staff').toUpperCase()" variant="plain" prepend-inner-icon="tabler:IconUser"
              :error-messages="errorMessage" class="w-100" @update:model-value="onStaffSelect"></v-select>
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <Field name="lat" v-slot="{ field, errorMessage }">
            <BaseTextField v-model="field.value" v-bind="field" :label="t('location.form.lat')" type="number" step="any"
              variant="plain" prependIcon="tabler:IconWorldLatitude"" :error-messages="errorMessage" class="w-100">
            </BaseTextField>
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <Field name="lon" v-slot="{ field, errorMessage }">
            <BaseTextField v-model="field.value" v-bind="field" :label="t('location.form.lon')" type="number" step="any"
              variant="plain" prependIcon="tabler:IconWorldLongitude" :error-messages="errorMessage" class="w-100">
            </BaseTextField>
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <Field name="allow_meter" v-slot="{ field, errorMessage }">
            <BaseTextField v-model="field.value" v-bind="field" :label="t('location.form.allow_meter')" type="number"
              variant="plain" prependIcon="tabler:IconRuler2" :error-messages="errorMessage" class="w-100">
            </BaseTextField>
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <Field name="device_uuid" v-slot="{ field, errorMessage }">
            <BaseTextField v-model="field.value" v-bind="field" :label="t('location.form.device_uuid')" type="text"
              variant="plain" prependIcon="tabler:IconDeviceImacCode" :error-messages="errorMessage" class="w-100">
            </BaseTextField>
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="d-flex ga-2 align-center">
            <BaseButton type="submit" class="w-100">
              {{ t('common.submit') }}
            </BaseButton>
            <BaseButton v-if="isEditMode" type="button" class="w-100" @click="resetFormMode">
              {{ t('common.cancel') }}
            </BaseButton>
          </div>
        </v-col>
      </v-row>
    </Form>
  </ParentCard>

  <div v-if="hasInitialData" class="mt-4">
    <v-row align="center" class="mb-3">
      <v-col cols="12" sm="7" lg="9">
        <BaseTitle>{{ t('location.title2') }}</BaseTitle>
      </v-col>
      <v-col cols="12" sm="5" lg="3">
        <BaseTextField v-model="search" :label="t('common.search')" color="primary" prependIcon="tabler:IconSearch"
          hide-details class="w-100"></BaseTextField>
      </v-col>
    </v-row>

    <ParentCard>
      <BaseTable :headers="headers" :items="formattedItems">
        <template #[`item.work_type`]="{ item }">
          <v-chip size="small" :color="item.work_type === 1 ? 'success' : item.work_type === 2 ? 'info' : 'grey'"
            variant="tonal">
            {{ item.work_type === 1 ? 'On Site' : item.work_type === 2 ? 'Remote' : 'Not Set' }}
          </v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-end ga-1">
            <BaseButton elevation="0" @click.stop="scrollToEdit(item)" color="" class="edit-btn" size="small">
              <v-icon icon="tabler:IconEdit" size="15" />
            </BaseButton>
            <BaseButton elevation="0" color="" class="delete-btn" size="small" :add-class="['ma-1']"
              @click.stop="showConfirmDelete(item.id)">
              <v-icon icon="tabler:IconTrash" size="15" />
            </BaseButton>
          </div>
        </template>
      </BaseTable>
    </ParentCard>
  </div>

  <BaseConfirmDelete v-model="confirmDelete" :text="t('location.deleteConfirmText')"
    :class="{ 'd-none': !confirmDelete }" @yes="
      confirmDelete = false;
    deleteLocation();
    " @no="
      confirmDelete = false;
    deleteTarget = undefined;
    " />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '@/stores/auth/auth.js';
import { getLocationSchema } from '@/plugins/validations/location.js';
import { ADMIN } from '@/utils/constant';

const { t } = useI18n();
const authStore = useAuthStore();

const role = computed(() => authStore.staffRole || localStorage.getItem('staff-role'));
const deleteTarget = ref(undefined);
const confirmDelete = ref(undefined);
const formRef = ref(null);
const isEditMode = ref(false);
const search = ref('');
const originalItems = ref([]);
const items = ref([]);
const hasInitialData = ref(false);

const locationSchema = computed(() => getLocationSchema(t));

const staffOptions = computed(() =>
  originalItems.value.map((item) => ({
    id: item.id,
    label: `${item.eng_name}`,
  }))
);

const resetFormMode = () => {
  isEditMode.value = false;
  formRef.value?.resetForm();
};

const fetch = async () => {
  resetFormMode();
  try {
    const data = await authStore.fetchLocationStaffs();

    const list = Array.isArray(data) ? data : (data?.data || []);
    originalItems.value = [...list];
    items.value = [...list];
    hasInitialData.value = list.length > 0;
  } catch (e) {
    console.error('Fetch Location Staffs Error:', e);
  }
};

// Call on mounted hook
onMounted(() => {
  fetch();
});

const onStaffSelect = (staffId) => {
  const target = originalItems.value.find((item) => item.id === staffId);
  if (target) {
    formRef.value?.setValues({
      staff_id: target.id,
      lat: target.lat,
      lon: target.lon,
      allow_meter: target.allow_meter,
      device_uuid: target.device_uuid,
    });
  }
};

const headers = computed(() => {
  const tmpHeaders = [
    { title: t('location.table.staff'), key: 'eng_name', },
    { title: t('location.table.work_type'), key: 'work_type', },
    { title: t('location.table.lat'), key: 'lat', sortable: false },
    { title: t('location.table.lon'), key: 'lon', sortable: false },
    { title: t('location.table.allow_meter'), key: 'allow_meter', sortable: false },
    { title: t('location.table.device_uuid'), key: 'device_uuid', sortable: false },
  ];

  if (String(role.value) === String(ADMIN)) {
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

const formattedItems = computed(() => {
  return items.value.map((item) => ({
    ...item,
    lat: item.lat || '-',
    lon: item.lon || '-',
    allow_meter: item.allow_meter ?? '-',
    device_uuid: item.device_uuid || '-',
  }));
});

const scrollToEdit = (item) => {
  isEditMode.value = true;
  formRef.value?.setValues({
    staff_id: item.id,
    lat: item.lat,
    lon: item.lon,
    allow_meter: item.allow_meter,
    device_uuid: item.device_uuid,
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};

const deleteLocation = async () => {
  await authStore.deleteLocation({ id: deleteTarget.value });
  deleteTarget.value = undefined;
  fetch();
};


const submit = async (values, { setErrors }) => {
  console.log("values", values);
  try {
    await authStore.saveStaffLocation(values);
    await fetch();
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      console.error('Submit Location Error:', error);
    }
  }
};

watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      items.value = originalItems.value.filter((item) =>
        Object.values(item).some((val) =>
          String(val ?? '').toLowerCase().includes(newVal.toLowerCase())
        )
      );
    } else {
      items.value = [...originalItems.value];
    }
  }
);
</script>