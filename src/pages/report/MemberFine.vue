<template>
  <BaseTitle> {{ t('memberFine.title1') }} </BaseTitle>
  <ParentCard class="pa-2">
     <v-row class="align-center">
       <v-col cols="12" md="12">
         <Form
         ref="formRef"
         :validation-schema="memberFineValidation"
         @submit="submit"
         >
            <div class="d-flex flex-wrap align-center justify-space-around">
                <Field name="staff" v-slot="{ field, errorMessage }" >
                  <BaseSelect
                    v-model="field.value"
                    v-bind="field"
                    item-value="id"
                    item-title="name"
                    :items="memberList"
                    :label="t('memberFine.form.name')"
                    variant="plain"
                    prependIcon="mdi-account-tie"
                    :error-messages="errorMessage"
                    :width="'300px'"
                  />
                </Field>
                <Field name="date" v-slot="{ field, errorMessage }" >
                  <BaseDatePicker
                    v-model="field.value"
                    v-bind="field"
                    :label="t('memberFine.form.date')"
                    prependIcon="mdi-calendar-month"
                    :error-messages="errorMessage"
                    :width="'300px'"
                    style="flex: none"
                  />
                </Field>
                <!-- <Field name="time"  v-slot="{ field, errorMessage }">
                  <BaseTimePicker  
                    v-model="field.value"
                    v-bind="field"
                    :label="t('memberFine.form.time')"
                    width="90%"
                    prependIcon="mdi-clock-outline"
                    :error-messages="errorMessage" />
                </Field> -->

            <Field name="time" v-slot="{ field, errorMessage }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('memberFine.form.time')"
                :items="lateTimes"
                prependIcon="tabler:IconClockHour5"
                item-title="name"
                item-value="id"
                :error-messages="errorMessage"
                :width="'300px'"
              >
              </BaseSelect>
            </Field>
            <BaseButton type="submit" :width="'200px'">
              {{ t('common.submit') }}
            </BaseButton>
          </div>
        </Form>
      </v-col>
    </v-row>
  </ParentCard>

  <div v-if="status">
    <div class="mt-5 d-flex">
      <BaseTitle> {{ t('memberFine.title2') }} </BaseTitle>
    </div>
    <ParentCard>
      <div class="mb-3 text-right">
        <v-menu
          v-model="dialog"
          location="top"
          offset-y
          transition="fade-transition"
        >
          <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            color="primary"
            density="comfortable"
            class="filter-btn"
            icon
          >
            <v-icon>mdi-filter-cog-outline</v-icon>
             <v-tooltip
                activator="parent"
                location="top"
                >{{ t('common.filter') }}</v-tooltip
              >
          </v-btn>
        </template>

         <ParentCard @click.stop>
          <div>
              <BaseSelect
                  v-model="selectedName"
                  :label="t('memberFine.form.name')"
                  item-value="eng_name"
                  item-title="name"
                  :items="memberList"
                  :width="'200px'"
                   prependIcon="mdi-account-tie"
                  >
              </BaseSelect>
              <BaseSelect
                  v-model="selectedMonth"
                  item-value="id"
                  item-title="name"
                  :items = "months"
                  :label="t('memberFine.form.month')"
                  :width="'200px'"
                  prependIcon="mdi-calendar-month"
                >
            </BaseSelect>
          </div>
        </ParentCard>
        </v-menu>
      </div>
      <BaseTable
        :headers="headers"
        :items="finesWithStatusAndTotal"
        :style="{ minHeight: windowHeight }"
      >
        <template #[`item.time`]="{ item }">
          <span class="time-box d-inline-flex justify-center align-center">
            <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
            {{ item.time }}
          </span>
        </template>
        <template #[`item.fine`]="{ item }">
          <span class="money-box d-inline-flex justify-center align-center">
            {{ item.fine + ' Ks' }}
          </span>
        </template>
        <template #[`item.total`]="{ item }">
          <span class="money-box d-inline-flex justify-center align-center">
            {{ item.total + ' Ks' }}
          </span>
        </template>
        <template #[`item.status`]="{ item }">
          <span class="d-flex justify-left align-center">
            <span
              class="status-label mr-5"
              :style="{
                backgroundColor: item.switchValue
                  ? 'rgba(var(--v-theme-complete), 0.2)'
                  : 'rgba(var(--v-theme-pending), 0.2)',
                color: item.switchValue ? '#789f00ff' : '#ff9800',
              }"
            >
              <v-icon size="16" class="mr-1">
                {{
                  item.switchValue
                    ? 'mdi-check-circle-outline'
                    : 'mdi-timer-sand'
                }}
              </v-icon>
              {{ item.switchValue ? 'Complete' : 'Pending' }}</span
            >
            <span>
              <v-switch
                color="primary"
                density="compact"
                hide-details="true"
                v-model="item.switchValue"
                @update:modelValue="onSwitchChange(item)"
                style="transform: scale(0.8)"
              ></v-switch>
            </span>
          </span>
        </template>
        <template #[`item.action`]="{ item }">
          <span class="d-flex justify-left align-center p-0">
            <BaseButton
              elevation="0"
              color=""
              class="delete-btn"
              size="small"
              :add-class="['ma-1']"
              @click.stop="showConfirmDelete(item.id)"
            >
              <v-icon
                icon="tabler:IconTrash"
                size="15"
                style="color: #ff0000"
              />
            </BaseButton>
          </span>
        </template>
      </BaseTable>
    </ParentCard>
  </div>
  <BaseConfirmDelete
    v-model="confirmDelete"
    :text="t('memberFine.deleteConfirmText')"
    :class="{ 'd-none': !confirmDelete }"
    @yes="
      confirmDelete = false;
      deleteMemberFine();
    "
    @no="
      confirmDelete = false;
      deleteTarget = undefined;
    "
  ></BaseConfirmDelete>
  <BaseConfirmDelete
    v-model="confirmChange"
    :text="t('memberFine.statusConfirmText')"
    :class="{ 'd-none': !confirmChange }"
    @yes="
      confirmChange = false;
      changeStatus(switchTarget);
    "
    @no="
      confirmChange = false;
      switchTarget.switchValue = !switchTarget.switchValue;
      switchTarget = null;
    "
  ></BaseConfirmDelete>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'; 
import { useI18n } from 'vue-i18n';
import { useMemberStore } from '@/stores/member/member.js';
import { useMemberFineStore } from '@/stores/member/member-fine.js';
import { getMemberFineValidation } from '@/plugins/validations/member-fine.js';
import { lateTimes, months } from '@/utils/data';

const { t, locale } = useI18n();
const memberStore = useMemberStore();
const items = ref([]);
const fines = ref([]);
const selectedName = ref(null);
const selectedMonth = ref(null);
const switchTarget = ref(null);
const memberFineStore = useMemberFineStore();
const deleteTarget = ref(undefined);
const confirmDelete = ref(undefined);
const confirmChange = ref(undefined);
const status = ref(true);
const lang = ref(locale.value);
const dialog = ref(false);
const headers = computed(() => {
  const lan = locale.value
  const tmpHeaders = [
    {
      title: t('memberFine.form.name'),
      key: lan == "ja" ? 'jp_name':'eng_name',
      align: 'left',  
    },
    {
      title: t('memberFine.form.date'),
      key: 'date',
      align: 'left',
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
let windowHeight, itemsCount;
if (window.innerWidth > 1366) {
  windowHeight = window.innerHeight / 1.4;
  itemsCount = 10;
} else {
  windowHeight = window.innerHeight / 1.8;
  itemsCount = 5;
}

const memberFineValidation = computed(() => getMemberFineValidation(t));

onMounted(() => {
  fetchData();
  fetchMemberFines();
});

const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';
  return (
    memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: isJapanese ? member.jp_name : member.eng_name,
      eng_name: member.eng_name
    })) || []
  );
});

const fetchData = async () => {
  try {
    await memberStore.fetchMember();
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

const fetchMemberFines = async () => {
  try {
  const AllFine =  await memberFineStore.fetchMemberFine();
  status.value = AllFine.data.data.length === 0 ? false : true;
  const tmpMembersFines = memberFineStore.getMemberFine.data?.map((memberFine) => ({
      id: memberFine.id,
      eng_name: memberFine.staff.eng_name,
      jp_name: memberFine.staff.jp_name,
      date: memberFine.date,
      time: memberFine.time,
      status: memberFine.status,
      total: memberFine.total,
      fine: parseInt(memberFine.amount),
      switchValue: memberFine.status === 1,
    }));
    fines.value = [...tmpMembersFines];
  } catch (error) {
    console.error('Error fetching members fines:', error);
  }
};

const submit = async (values) => {
  await memberFineStore.createMemberFine(values);
  fetchMemberFines();
};

const finesWithStatusAndTotal = computed(() => {
  const finesCopy = JSON.parse(JSON.stringify(fines.value));

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const previousMonthDate = new Date(currentYear, currentMonth - 2, 1);
  const previousMonth = previousMonthDate.getMonth() + 1;
  const previousYear = previousMonthDate.getFullYear();

  const filteredFines = finesCopy.filter((fine) => {
    const fineDate = new Date(fine.date);
    const fineMonth = fineDate.getMonth() + 1;
    const fineYear = fineDate.getFullYear();

    const matchName = selectedName.value
      ? fine.eng_name === selectedName.value
      : true;
    const matchMonth = selectedMonth.value
      ? fineMonth === selectedMonth.value
      : true;

    const noFiltersSelected = !selectedName.value && !selectedMonth.value;
    const matchRecentMonths =
      (fineMonth === currentMonth && fineYear === currentYear) ||
      (fineMonth === previousMonth && fineYear === previousYear);

    return noFiltersSelected ? matchRecentMonths : matchName && matchMonth;
  });

  const groupedByStaffAndMonth = {};

  filteredFines.forEach((fine) => {
    const date = new Date(fine.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const key = `${fine.name}-${monthYear}`;

    if (!groupedByStaffAndMonth[key]) {
      groupedByStaffAndMonth[key] = [];
    }
    groupedByStaffAndMonth[key].push(fine);
  });

  Object.values(groupedByStaffAndMonth).forEach((group) => {
    let runningTotal = 0;
    group.forEach((fine) => {
      runningTotal += parseFloat(fine.fine);
      fine.total = runningTotal;
      fine.status = fine.status === 0 ? 'Pending' : 'Complete';
    });
  });

  return filteredFines;
});

const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};

const onSwitchChange = (item) => {
  switchTarget.value = item;
  confirmChange.value = true;
};

const deleteMemberFine = async () => {
  await memberFineStore.deleteMemberFine({ id: deleteTarget.value });
  deleteTarget.value = undefined;
  fetchMemberFines();
};

const changeStatus = async (item) => {
  try {
    const newStatus = item.switchValue ? 0 : 1;
    await memberFineStore.updateMemberFineStatus({
      id: item.id,
      status: newStatus,
    });
    fetchMemberFines();
  } catch (err) {
    console.error('Error updating status:', err);
  } finally {
    switchTarget.value = null;
  }
};

watch(locale, (newLocale) => {
  lang.value = newLocale;
});

</script>
<style scoped>
.no-message-switch .v-input__details {
  display: none !important;
}
.time-box {
  background-color: rgba(var(--v-theme-primary), 0.2);
  border-radius: 4px;
  padding: 3px 9px;
  /* min-width: 90px; */
  /* height: 28px; */
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
  /* font-weight: 500; */
  display: inline-block;
  text-align: center;
  font-weight: 800;
}
::v-deep(.filter-btn .v-btn__content) {
  color: white !important;
}
</style>
