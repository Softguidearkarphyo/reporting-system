<template>
  <BaseTitle>{{ t('memberFine.title1') }}</BaseTitle>

  <ParentCard class="mb-3">
    <Form ref="formRef" :validation-schema="memberFineValidation" @submit="submit">
      <v-row dense align="center">
        <v-col cols="12" sm="6" md="3">
          <Field name="staff" v-slot="{ field, errorMessage }">
            <BaseSelect v-model="field.value" v-bind="field" item-value="id" item-title="name" :items="memberList"
              :label="t('memberFine.form.name')" variant="outlined" density="compact" prependIcon="tabler:IconUserCog"
              :error-messages="errorMessage" hide-details="auto" class="w-100" />
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <Field name="date" v-slot="{ field, errorMessage }">
            <BaseGoogleCalendar :model-value="field.value" v-bind="field" :label="t('memberFine.form.date')"
              prependIcon="mdi-calendar-month" class="w-100" :error-messages="errorMessage" clearable
              :disabled="isLoading || isSubmitting" @update:modelValue="
                (date) => {
                  field.onChange(date);
                }
              " />
          </Field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <Field name="time" v-slot="{ field, errorMessage }">
            <BaseTimePicker :model-value="field.value" @update:model-value="field.onChange" @blur="field.onBlur"
              :label="t('memberFine.form.time')" :error-messages="errorMessage" prependIcon="mdi-clock-outline"
              class="w-100" />
          </Field>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="mt-2 mt-md-0">
          <BaseButton type="submit" block color="primary" class="submit-btn text-none font-weight-bold"
            style="height: 40px;" :loading="isSubmitting">
            {{ t('common.submit') }}
          </BaseButton>
        </v-col>
      </v-row>
    </Form>
  </ParentCard>

  <div v-if="status">
    <ParentCard class="mt-3">
      <div class="d-flex justify-space-between align-center mb-3">
        <BaseTitle>{{ t('memberFine.title2') }}</BaseTitle>

        <v-menu v-model="dialog" location="bottom end" offset-y transition="fade-transition">
          <template #activator="{ props: tooltipProps }">
            <v-btn v-bind="tooltipProps" color="primary" density="comfortable" class="filter-btn" icon>
              <v-icon>mdi-filter-cog-outline</v-icon>

              <v-tooltip activator="parent" location="top">
                {{ t('common.filter') }}
              </v-tooltip>
            </v-btn>
          </template>

          <ParentCard @click.stop style="min-width: 240px">
            <div class="d-flex flex-column ga-3">
              <BaseSelect v-model="selectedName" :label="t('memberFine.form.name')" item-value="eng_name"
                item-title="name" :items="memberList" prependIcon="mdi-account-tie" class="w-100" />

              <BaseSelect v-model="selectedMonth" item-value="id" item-title="name" :items="months"
                :label="t('memberFine.form.month')" prependIcon="mdi-calendar-month" class="w-100" />
            </div>
          </ParentCard>
        </v-menu>
      </div>

      <BaseTable :headers="headers" :items="finesWithStatusAndTotal" :loading="isLoading">
        <template #[`item.time`]="{ item }">
          <span class="time-box d-inline-flex justify-center align-center">
            <v-icon size="16" class="mr-1">
              mdi-clock-outline
            </v-icon>
            {{ item.time }}
          </span>
        </template>

        <template #[`item.fine`]="{ item }">
          <span class="money-box d-inline-flex justify-center align-center">
            {{ item.fine }} Ks
          </span>
        </template>

        <template #[`item.total`]="{ item }">
          <span class="money-box d-inline-flex justify-center align-center">
            {{ item.total }} Ks
          </span>
        </template>

        <template #[`item.count`]="{ item }">
          <span class="time-box d-inline-flex justify-center align-center p-2 rounded-pill">
            {{ item.count }}
          </span>

          <v-icon v-if="item.count > 2" :style="{
            color: item.count > 3 ? '#d00000' : '#ffba08',
          }" class="ms-1">
            {{
              item.count > 3
                ? 'mdi-fire-alert'
                : 'mdi-alert-decagram-outline'
            }}
          </v-icon>
        </template>

        <template #[`item.status`]="{ item }">
          <span class="d-flex justify-start align-center">
            <span class="status-label mr-3" :style="{
              backgroundColor: item.switchValue
                ? 'rgba(var(--v-theme-complete), 0.2)'
                : 'rgba(var(--v-theme-pending), 0.2)',
              color: item.switchValue
                ? '#789f00'
                : '#ff9800',
            }">
              <v-icon size="16" class="mr-1">
                {{
                  item.switchValue
                    ? 'mdi-check-circle-outline'
                    : 'mdi-timer-sand'
                }}
              </v-icon>

              {{ item.switchValue ? 'Complete' : 'Pending' }}
            </span>

            <v-switch v-model="item.switchValue" color="primary" density="compact" hide-details
              style="transform: scale(0.7)" @update:modelValue="onSwitchChange(item)" />
          </span>
        </template>

        <template #[`item.action`]="{ item }">
          <span class="d-flex justify-start align-center p-0">
            <BaseButton elevation="0" color="" class="delete-btn" size="small" :add-class="['ma-1']"
              :loading="isSubmitting" @click.stop="showConfirmDelete(item.id)">
              <v-icon icon="tabler:IconTrash" size="15" />
            </BaseButton>
          </span>
        </template>
      </BaseTable>
    </ParentCard>
  </div>

  <BaseConfirmDelete v-model="confirmDelete" :text="t('memberFine.deleteConfirmText')"
    :class="{ 'd-none': !confirmDelete }" @yes="
      confirmDelete = false;
    deleteMemberFine();
    " @no="
      confirmDelete = false;
    deleteTarget = undefined;
    " />

  <BaseConfirmDelete v-model="confirmChange" :text="t('memberFine.statusConfirmText')"
    :class="{ 'd-none': !confirmChange }" @yes="
      confirmChange = false;
    changeStatus(switchTarget);
    " @no="
      confirmChange = false;
    if (switchTarget) {
      switchTarget.switchValue = !switchTarget.switchValue;
      switchTarget = null;
    }
    " />
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { useMemberStore } from '@/stores/member/member.js';

import {
  useMemberFineStore,
} from '@/stores/member/member-fine.js';

import {
  getMemberFineValidation,
} from '@/plugins/validations/member-fine.js';

import {
  months,
} from '@/utils/data';

const { t, locale } = useI18n();

const memberStore = useMemberStore();

const memberFineStore = useMemberFineStore();



const fines = ref([]);

const selectedName = ref(null);

const selectedMonth = ref(null);

const switchTarget = ref(null);

const deleteTarget = ref(undefined);

const confirmDelete = ref(undefined);

const confirmChange = ref(undefined);

const status = ref(true);

const lang = ref(locale.value);

const dialog = ref(false);

const isLoading = ref(false);
const isSubmitting = ref(false);

const memberFineValidation = computed(() =>
  getMemberFineValidation(t)
);


const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';

  return (
    memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: isJapanese
        ? member.jp_name
        : member.eng_name,
      eng_name: member.eng_name,
    })) || []
  );
});


const headers = computed(() => {
  const lan = locale.value;

  const tmpHeaders = [
    {
      title: t('memberFine.form.name'),
      key: lan === 'ja'
        ? 'jp_name'
        : 'eng_name',
      align: 'left',
    },

    {
      title: t('memberFine.form.date'),
      key: 'date',
      align: 'left',
      sortable: true,
      sortDirection: 'desc',
    },

    {
      title: t('memberFine.form.time'),
      key: 'time',
      align: 'left',
    },

    {
      title: t('memberFine.form.fine'),
      key: 'fine',
      align: 'left',
    },

    {
      title: t('memberFine.form.total'),
      key: 'total',
      align: 'left',
    },

    {
      title: t('memberFine.form.count'),
      key: 'count',
      align: 'left',
    },

    {
      title: t('memberFine.form.status'),
      key: 'status',
      align: 'left',
    },

    {
      title: t('memberFine.form.action'),
      key: 'action',
      align: 'left',
      sortable: false,
      width: '10%',
    },
  ];

  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title.toUpperCase(),
  }));
});


onMounted(() => {
  fetchData();
  fetchMemberFines();
});

const fetchData = async () => {
  try {
    await memberStore.fetchMember();
  } catch (error) {
    console.error(
      'Error fetching members:',
      error
    );
  }
};

const fetchMemberFines = async () => {
  isLoading.value = true;
  try {
    const payload = {};
    const response = await memberFineStore.fetchMemberFine(payload);

    const finesData = response?.data?.data || memberFineStore.getMemberFine?.data || [];

    status.value = finesData.length > 0;

    const tmpMembersFines = finesData.map((memberFine) => ({
      id: memberFine.id,
      eng_name: memberFine.staff?.eng_name || '',
      jp_name: memberFine.staff?.jp_name || '',
      date: memberFine.date,
      time: memberFine.time,
      status: memberFine.status,
      fine: parseInt(memberFine.amount || 0),
      switchValue: memberFine.status === 1,
    }));

    fines.value = [...tmpMembersFines];
  } catch (error) {
    console.error('Error fetching members fines:', error);
    status.value = false;
    fines.value = [];
  } finally {
    isLoading.value = false;
  }
};


const submit = async (values) => {
  isSubmitting.value = true;
  try {
    let formattedTime = values.time;
    if (formattedTime && formattedTime.split(':').length > 3) {
      const parts = formattedTime.split(':');
      formattedTime = `${parts[0]}:${parts[1]}:${parts[2]}`;
    }

    const payload = {
      ...values,
      time: formattedTime,
    };

    await memberFineStore.createMemberFine(payload);
    await fetchMemberFines();
  } catch (error) {
    console.error('Error creating member fine:', error);
  } finally {
    isSubmitting.value = false;
  }
};


const finesWithStatusAndTotal = computed(() => {
  const finesCopy = JSON.parse(
    JSON.stringify(fines.value)
  );

  // Filter fines based on user selection; if no selection, return true for all items
  const filteredFines = finesCopy.filter((fine) => {
    const fineDate = new Date(fine.date);
    const fineMonth = fineDate.getMonth() + 1;

    const matchName = selectedName.value
      ? fine.eng_name === selectedName.value
      : true;

    const matchMonth = selectedMonth.value
      ? fineMonth === selectedMonth.value
      : true;

    return matchName && matchMonth;
  });

  // Grouping to calculate running total and fine counts per member/month
  const groupedByStaffAndMonth = {};

  filteredFines.forEach((fine) => {
    const date = new Date(fine.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const key = `${fine.eng_name}-${monthYear}`;

    if (!groupedByStaffAndMonth[key]) {
      groupedByStaffAndMonth[key] = [];
    }

    groupedByStaffAndMonth[key].push(fine);
  });

  Object.values(groupedByStaffAndMonth).forEach((group) => {
    let runningTotal = 0;

    group.forEach((fine, i) => {
      runningTotal += parseFloat(fine.fine);

      fine.total = runningTotal;
      fine.status = fine.status === 0 ? 'Pending' : 'Complete';
      fine.count = i + 1;
    });
  });

  return filteredFines.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
});


const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};


const deleteMemberFine = async () => {
  try {
    await memberFineStore.deleteMemberFine({
      id: deleteTarget.value,
    });

    deleteTarget.value =
      undefined;

    await fetchMemberFines();
  } catch (error) {
    console.error(
      'Error deleting member fine:',
      error
    );
  }
};


const onSwitchChange = (item) => {
  switchTarget.value = item;
  confirmChange.value = true;
};


const changeStatus = async (item) => {
  if (!item) {
    return;
  }

  try {
    const status = item.status == 'Pending' ? 0 : 1
    // const newStatus =
    //     status
    //     ? 1
    //     : 0;

    await memberFineStore.updateMemberFineStatus({
      id: item.id,
      status: status,
    });

    await fetchMemberFines();
  } catch (err) {
    console.error(
      'Error updating status:',
      err
    );
  } finally {
    switchTarget.value =
      null;
  }
};

watch(
  locale,
  (newLocale) => {
    lang.value = newLocale;
  }
);
</script>

<style scoped>
.no-message-switch .v-input__details {
  display: none !important;
}

.time-box {
  background-color: rgba(var(--v-theme-primary),
      0.2);
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 800;
  color: rgba(var(--v-theme-primary));
}

.money-box {
  background-color: #dbbcfb98;
  padding: 3px 13px;
  border-radius: 4px;
  font-size: 10px;
  color: #8000ffb6 !important;
  font-weight: 800;
}

.status-label {
  padding: 3px;
  border-radius: 4px;
  min-width: 85px;
  font-size: 10px;
  display: inline-block;
  text-align: center;
  font-weight: 800;
}

::v-deep(.filter-btn .v-btn__content) {
  color: white !important;
}
</style>
