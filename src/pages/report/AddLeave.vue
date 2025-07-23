<template>
  <v-row class="py-6">
    <v-col cols="12">
      <v-radio-group v-model="employeeType" inline>
        <v-radio label="New Employee" value="new" />
        <v-radio label="Existing Employee" value="existing" />
      </v-radio-group>
    </v-col>
  </v-row>

  <!-- New Employee Form -->
  <v-row v-if="employeeType === 'new'" class="my-4">
    <v-col cols="12" md="4">
      <v-text-field v-model="newEmp.name" label="Employee Name" />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field
        v-model="newEmp.pernentDate"
        label="Pernent Date (YYYY-MM)"
        type="month"
      />
    </v-col>
    <v-col cols="12" md="4" class="d-flex align-center">
      <v-btn color="primary" @click="submitNewEmployee">Submit</v-btn>
    </v-col>
  </v-row>

  <!-- Existing Employee Form -->
  <v-row v-if="employeeType === 'existing'" class="my-4">
    <v-col cols="12" md="3">
      <v-text-field v-model="existingEmp.name" label="Employee Name" />
    </v-col>
    <v-col cols="12" md="3">
      <v-text-field
        v-model="existingEmp.leaveDate"
        type="date"
        label="Leave Date"
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="existingEmp.leaveTime"
        :items="['Full Day', 'Half Day (Morning)', 'Half Day (Afternoon)']"
        label="Leave Time"
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="existingEmp.otTime"
        :items="['None', '1 hour', '2 hours', '3+ hours']"
        label="OT Time"
      />
    </v-col>
    <v-col cols="12" class="text-right">
      <v-btn color="primary" @click="submitExistingEmployee">Submit</v-btn>
    </v-col>
  </v-row>

  <!-- Table -->
  <v-row>
    <v-col cols="12">
      {{ headers }}
      <v-data-table
        :headers="headers"
        :items="employeeTable"
        class="elevation-1"
        item-value="name"
      >
        <template #item.pernentDate="{ item }">
          {{ formatDate(item.pernentDate) }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';

const employeeType = ref('new');

const newEmp = ref({
  name: '',
  pernentDate: '',
});

const existingEmp = ref({
  name: '',
  leaveDate: '',
  leaveTime: '',
  otTime: '',
});

const employeeTable = ref([]);

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Pernent Date', value: 'pernentDate' },
  { text: 'Calculated Leave', value: 'getcalleave' },
];

function submitNewEmployee() {
  if (!newEmp.value.name || !newEmp.value.pernentDate) {
    alert('Please fill all fields');
    return;
  }

  const month = Number(newEmp.value.pernentDate.split('-')[1]);
  alert(month);
  const remainingMonths = 12 - month + 1;
  const leave = Math.round(((remainingMonths * 10) / 12) * 2) / 2;

  employeeTable.value.push({
    name: newEmp.value.name,
    pernentDate: newEmp.value.pernentDate,
    getcalleave: leave,
  });

  // Reset
  newEmp.value.name = '';
  newEmp.value.pernentDate = '';
}

function submitExistingEmployee() {
  if (!existingEmp.value.name || !existingEmp.value.leaveDate) {
    alert('Please fill all fields');
    return;
  }

  console.log('Existing Leave Info:', { ...existingEmp.value });

  // Reset
  existingEmp.value.name = '';
  existingEmp.value.leaveDate = '';
  existingEmp.value.leaveTime = '';
  existingEmp.value.otTime = '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}
</script>
