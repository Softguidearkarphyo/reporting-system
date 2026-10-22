<template>
  <BaseTitle class="mb-3">
    {{ t('location.title1') }}
  </BaseTitle>

  <ParentCard>
    <Form ref="formRef" :validation-schema="locationSchema" @submit="submit">
      <fieldset :disabled="isLoading || isSubmitting" class="border-0 p-0 m-0">
        <v-row align="center" justify="start" class="py-1 ga-2 ga-md-0">
          <v-col cols="12" sm="6" md="4" lg="2">
            <BaseSelect
              v-if="!selectedMember"
              v-model="selectedMemberId"
              :label="t('creatLeave.options.employee')"
              :items="memberList"
              item-value="id"
              item-title="name"
              prependIcon="tabler:IconUserCog"
              class="w-100"
              @update:modelValue="selectMember"
            />

            <v-checkbox
              v-else
              v-model="isChecked"
              :label="t('creatLeave.options.selected_name') + selectName"
              hide-details
              color="primary"
              class="custom-checkbox"
              @update:modelValue="onCheckboxChange"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <Field name="lat" v-slot="{ field, errorMessage }">
              <BaseTextField 
                v-model="field.value" 
                v-bind="field" 
                :label="t('location.form.lat')" 
                type="number" 
                step="any"
                variant="plain" 
                prependIcon="tabler:IconWorldLatitude" 
                :error-messages="errorMessage" 
                class="w-100"
              />
            </Field>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <Field name="lon" v-slot="{ field, errorMessage }">
              <BaseTextField 
                v-model="field.value" 
                v-bind="field" 
                :label="t('location.form.lon')" 
                type="number" 
                step="any"
                variant="plain" 
                prependIcon="tabler:IconWorldLongitude" 
                :error-messages="errorMessage" 
                class="w-100"
              />
            </Field>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <Field name="allow_meter" v-slot="{ field, errorMessage }">
              <BaseTextField 
                v-model="field.value" 
                v-bind="field" 
                :label="t('location.form.allow_meter')" 
                type="number"
                variant="plain" 
                prependIcon="tabler:IconRuler2" 
                :error-messages="errorMessage" 
                class="w-100"
              />
            </Field>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <Field name="device_uuid" v-slot="{ field, errorMessage }">
              <BaseTextField 
                v-model="field.value" 
                v-bind="field" 
                :label="t('location.form.device_uuid')" 
                type="text"
                variant="plain" 
                prependIcon="tabler:IconDeviceImacCode" 
                :error-messages="errorMessage" 
                class="w-100"
              />
            </Field>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <div class="d-flex ga-2 align-center">
              <BaseButton 
                type="submit" 
                class="w-100 text-none font-weight-bold" 
                style="height: 40px;"
                :loading="isSubmitting"
                :disabled="isLoading"
              >
                {{ t('common.submit') }}
              </BaseButton>
              <BaseButton 
                v-if="isEditMode" 
                type="button" 
                class="w-100 text-none font-weight-bold" 
                style="height: 40px;"
                :disabled="isLoading || isSubmitting"
                @click="resetFormMode"
              >
                {{ t('common.cancel') }}
              </BaseButton>
            </div>
          </v-col>
        </v-row>
      </fieldset>
    </Form>
  </ParentCard>

  <div v-if="hasInitialData || isLoading" class="mt-4">
    <v-row align="center" class="mb-3">
      <v-col cols="12" sm="7" lg="9">
        <BaseTitle>{{ t('location.title2') }}</BaseTitle>
      </v-col>
      <v-col cols="12" sm="5" lg="3">
        <BaseTextField 
          v-model="search" 
          :label="t('common.search')" 
          color="primary" 
          prependIcon="tabler:IconSearch"
          hide-details 
          class="w-100"
          :disabled="isLoading"
        />
      </v-col>
    </v-row>

    <ParentCard>
      <BaseTable :headers="headers" :items="formattedItems" :loading="isLoading || isDeleting">
        <template #[`item.work_type`]="{ item }">
          <v-chip size="small" :color="item.work_type === 1 ? 'success' : item.work_type === 2 ? 'info' : 'grey'"
            variant="tonal">
            {{ item.work_type === 1 ? 'On Site' : item.work_type === 2 ? 'Remote' : 'Not Set' }}
          </v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex justify-end ga-1">
            <BaseButton 
              elevation="0" 
              @click.stop="scrollToEdit(item)" 
              color="" 
              class="edit-btn" 
              size="small"
              :disabled="isLoading || isSubmitting || isDeleting"
            >
              <v-icon icon="tabler:IconEdit" size="15" />
            </BaseButton>
            <BaseButton 
              elevation="0" 
              color="" 
              class="delete-btn" 
              size="small" 
              :add-class="['ma-1']"
              :disabled="isLoading || isSubmitting || isDeleting"
              @click.stop="showConfirmDelete(item.loc_id)"
            >
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
import { useMemberStore } from '@/stores/member/member.js';
import { getLocationSchema } from '@/plugins/validations/location.js';
import { ADMIN } from '@/utils/constant';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const memberStore = useMemberStore();

const role = computed(() => authStore.staffRole || localStorage.getItem('staff-role'));
const deleteTarget = ref(undefined);
const confirmDelete = ref(undefined);
const formRef = ref(null);
const isEditMode = ref(false);
const search = ref('');
const originalItems = ref([]);
const items = ref([]);
const hasInitialData = ref(true);

// Loading states
const isLoading = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);

const selectedMemberId = ref(null);
const isChecked = ref(true);

const locationSchema = computed(() => getLocationSchema(t));

const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';

  return (
    memberStore.getMembers
      ?.map((member) => ({
        id: member.id,
        name: isJapanese ? member.jp_name : member.eng_name,
        sort_key: member.sort_key,
      }))
      ?.sort((a, b) => {
        if (!a.sort_key) return 1;
        if (!b.sort_key) return -1;
        return a.sort_key - b.sort_key;
      }) || []
  );
});

const selectedMember = computed(() => {
  if (!memberList.value || !selectedMemberId.value) {
    return null;
  }
  return memberList.value.find((member) => member.id === selectedMemberId.value);
});

const selectName = computed(() => {
  return selectedMember.value ? selectedMember.value.name : '';
});

const resetFormMode = () => {
  isEditMode.value = false;
  selectedMemberId.value = null;
  isChecked.value = true;
  formRef.value?.resetForm();
};

const fetch = async () => {
  isLoading.value = true;
  resetFormMode();
  try {
    await memberStore.fetchMember();
    const data = await authStore.fetchLocationStaffs();

    const list = Array.isArray(data) ? data : (data?.data || []);
    originalItems.value = [...list];
    items.value = [...list];
    hasInitialData.value = list.length > 0;
  } catch (e) {
    console.error('Fetch Location Staffs Error:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetch();
});

const selectMember = async (id) => {
  try {
    if (!memberStore.getMembers?.length) {
      await memberStore.fetchMember();
    }

    const member = originalItems.value.find((item) => item.id === id);

    if (member) {
      formRef.value?.setValues({
        staff_id: member.id,
        loc_id : member.loc_id,
        lat: member.lat,
        lon: member.lon,
        allow_meter: member.allow_meter,
        device_uuid: member.device_uuid,
      });
    } else {
      formRef.value?.setFieldValue('staff_id', id);
    }
  } catch (error) {
    console.error('Select Member Error:', error);
  }
};

const onCheckboxChange = (val) => {
  if (!val) {
    selectedMemberId.value = null;
    isChecked.value = true;
    formRef.value?.setFieldValue('staff_id', null);
    formRef.value?.resetForm();
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
    loc_id: item.loc_id || '-',
    lat: item.lat || '-',
    lon: item.lon || '-',
    allow_meter: item.allow_meter ?? '-',
    device_uuid: item.device_uuid || '-',
  }));
});

const scrollToEdit = (item) => {
  isEditMode.value = true;
  selectedMemberId.value = item.id;
  isChecked.value = true;

  formRef.value?.setValues({
    staff_id: item.id,
    loc_id: item.loc_id,
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
  isDeleting.value = true;
  try {
    await authStore.deleteLocation({ id: deleteTarget.value });
    deleteTarget.value = undefined;
    await fetch();
  } catch (error) {
    console.error('Delete Location Error:', error);
  } finally {
    isDeleting.value = false;
  }
};

const submit = async (values, { setErrors }) => {
  isSubmitting.value = true;
  const payload = {
    ...values,
    staff_id: selectedMemberId.value || values.staff_id,
  };
  
  try {
    await authStore.saveStaffLocation(payload);
    await fetch();
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      setErrors(error.response.data.errors);
    } else {
      console.error('Submit Location Error:', error);
    }
  } finally {
    isSubmitting.value = false;
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