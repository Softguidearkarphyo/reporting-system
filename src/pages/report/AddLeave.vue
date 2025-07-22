<template>
  <v-container>
    <BaseTitle>{{ t('creatLeave.title') }}</BaseTitle>
    <!-- Potion Selector Card -->
    <ParentCard>
      <div>
        <v-row class="d-flex align-center justify-space-between" dense>
          <v-col cols="auto">
            <div class="font-weight-medium">
              {{ t('creatLeave.options.selection') }}
            </div>
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="selectedPotion"
              color="primary"
              :label="t('creatLeave.options.existing')"
              value="potions1"
              hide-details
              class="custom-checkbox"
            />
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="selectedPotion"
              color="primary"
              :label="t('creatLeave.options.new')"
              value="potions2"
              hide-details
              class="custom-checkbox"
            />
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="selectedPotion"
              color="primary"
              :label="t('creatLeave.options.ot')"
              value="potions3"
              hide-details
              class="custom-checkbox"
            />
          </v-col>
        </v-row>
      </div>
    </ParentCard>
    <v-row dense>
      <!-- First Card: 2/3 width -->
      <v-col cols="12" md="8">
        <ParentCard>
          <v-row dense>
            <!-- Two horizontal input fields -->
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form1.name')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconUserCog"
                :width="'400px'"
              />
            </v-col>
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form1.leave_type')"
                class="mx-auto"
                :items="leaveTypes"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconSpeakerphone"
                :width="'400px'"
              />
            </v-col>
          </v-row>
          <v-row class="mt-4" dense>
            <!-- Two horizontal input fields -->
            <v-col cols="12" md="6">
              <BaseSelect
                :label="t('creatLeave.form1.part_time')"
                class="mx-auto"
                :items="leaveDurations"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconUserCog"
                :width="'400px'"
              />
            </v-col>
            <v-col cols="12" md="6">
              <BaseTextField
                v-model="form1.reason"
                v-bind="field"
                :label="t('creatLeave.form1.reason')"
                class="mx-auto"
                type="text"
                variant="plain"
                prependIcon="tabler:IconHelpCircle"
                :width="'400px'"
              ></BaseTextField>
            </v-col>
          </v-row>
          <v-row class="mt-4" dense>
            <!-- Two horizontal input fields -->
            <v-col cols="12" md="6">
              <v-checkbox
                v-model="selectedPotion"
                color="primary"
                :label="t('creatLeave.options.existing')"
                value="potions1"
                hide-details
                class="custom-checkbox"
              />
            </v-col>
          </v-row>
          <v-row class="mt-4" dense>
            <!-- Two horizontal input fields -->
            <v-col cols="12" md="6">
              <BaseDatePicker
                v-model="form2.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form1.start_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
            <v-col cols="12" md="6">
              <BaseDatePicker
                v-model="form2.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form1.end_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseButton type="submit" style="width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </ParentCard>
      </v-col>

      <!-- Second Card: 1/3 width -->
      <v-col cols="12" md="4">
        <ParentCard>
          <v-row class="justify-center" dense>
            <v-col>
              <BaseSelect
                :label="t('creatLeave.form1.name')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconUserCog"
                :width="'400px'"
              />
            </v-col>
            <v-col>
              <BaseDatePicker
                v-model="form2.permanent_date"
                v-bind="field"
                :label="t('creatLeave.form2.permanent_date')"
                class="mx-auto"
                prependIcon="tabler:IconCalendarPin"
                :width="'400px'"
              ></BaseDatePicker>
            </v-col>
            <v-col>
              <BaseSelect
                :label="t('creatLeave.form3.ot_time')"
                class="mx-auto"
                :items="memberList"
                item-value="id"
                item-title="name"
                prependIcon="tabler:IconAlarm"
                :width="'400px'"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="d-flex justify-center">
              <BaseButton type="submit" style="width: 200px">
                {{ t('common.submit') }}
              </BaseButton>
            </v-col>
          </v-row>
        </ParentCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMemberStore } from '@/stores/member/member.js';
const { t, locale } = useI18n();
const memberStore = useMemberStore();

const potions = [
  { title: 'Potion 1', value: 'potions1' },
  { title: 'Potion 2', value: 'potions2' },
  { title: 'Potion 3', value: 'potions3' },
];
const leaveTypes = [
  { id: 1, name: 'Annual Leave' },
  { id: 2, name: 'Sick Leave' },
  { id: 3, name: 'Maternity Leave' },
  { id: 4, name: 'Paternity Leave' },
  { id: 5, name: 'Unpaid Leave' },
  // Add more leave types as needed
];
const leaveDurations = [
  { id: 1, name: 'Half Day' },
  { id: 2, name: '1 Day' },
  { id: 3, name: '2 Days' },
  { id: 4, name: '1 Week' },
  { id: 5, name: 'More than 1 Week' },
];

// Dropdown items for all selects
const dropdownItems = ['Option 1', 'Option 2', 'Option 3'];

const selectedPotion = ref('potions1'); // default selected potion

// Potion 1 form state
const form1 = ref({ select: '', input: '' });

// Potion 2 form state with checkboxes pre-checked as false
const form2 = ref({
  select: '',
  input: '',
  optionA: false, // change to true here if you want it pre-checked
  optionB: false,
  aSelect: '',
  bInput1: '',
  bInput2: '',
});

// Potion 3 form state
const form3 = ref({ select: '', number: '', text: '' });

const submittedData = ref([]);

const headers = [
  { title: 'Potion Type', key: 'type' },
  { title: 'Details', key: 'data' },
];

const memberList = computed(() => {
  const isJapanese = locale.value === 'ja';
  return (
    memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: isJapanese ? member.jp_name : member.eng_name,
    })) || []
  );
});
</script>
<style>
.custom-checkbox .v-label {
  font-size: 0.8rem; /* Label font size */
  /* font-weight: 600; */
}

.custom-checkbox {
  font-size: 84px; /* Checkbox icon size */
}
</style>
