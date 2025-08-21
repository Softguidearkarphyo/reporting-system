<template>
  <v-container>
    <v-main class="pa-6 pt-4">
      <!-- Leave Availability Cards -->
      <v-row class="mb-6" justify="space-between">
        <v-col
          v-for="(type, i) in leaveTypes"
          :key="i"
          cols="12"
          sm="6"
          md="2"
          class="px-1"
        >
          <v-card :class="borderClass" class="pa-3" rounded elevation="1">
            <div class="d-flex align-center">
              <v-progress-circular
                :model-value="type.remaining * 12.5"
                color="primary"
                size="60"
                width="6"
              >
                {{ type.remaining }}
              </v-progress-circular>
              <div class="ml-4">
                <div class="text-caption">Remaining</div>
                <div class="text-h6 font-weight-bold">{{ type.name }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Leave Approval + Chart -->
      <v-row class="mb-6" dense>
        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-h6">Leave Approval</v-card-title>
            <v-data-table
              :headers="headers"
              :items="leaveRequests"
              class="elevation-0"
            >
              <template #[`item.status`]="{ item }">
                <v-chip color="warning" text-color="black" size="small" label>{{
                  item.status
                }}</v-chip>
              </template>
              <template #[`item.action`]="">
                <v-btn icon size="x-small" color="green">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn icon size="x-small" color="red">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-h6">Team Leave Track</v-card-title>
            <v-card-text>
              <v-chart
                type="bar"
                :options="chartOptions"
                :series="chartSeries"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Leave Calendar -->
      <!-- <v-card rounded="lg" elevation="1">
        <v-card-title class="text-h6 d-flex justify-space-between">
          <div>Leave Calendar</div>
          <div class="text-caption text-grey">July 2023</div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row class="text-center">
            <v-col
              v-for="day in weekDays"
              :key="day"
              class="font-weight-medium"
            >
              {{ day }}
            </v-col>
          </v-row>
          <v-row class="text-center mt-2" dense>
            <v-col
              v-for="(day, i) in calendarDays"
              :key="i"
              class="py-2"
              :class="day.type"
            >
              <div>{{ day.date }}</div>
              <v-chip
                v-if="day.label"
                :color="day.color"
                size="x-small"
                class="mt-1"
                label
              >
                {{ day.label }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card> -->
    </v-main>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { borderClass } from '@/utils/border';
const tab = ref(0);

const leaveTypes = [
  { name: 'Sick', remaining: 8 },
  { name: 'Casual', remaining: 8 },
  { name: 'Earned', remaining: 8 },
  { name: 'Comp off', remaining: 8 },
  { name: 'Annual', remaining: 8 },
];

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Leave Type', key: 'type' },
  { title: 'Start Date', key: 'start' },
  { title: 'End Date', key: 'end' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'action' },
];

const leaveRequests = [
  {
    name: 'Jessica',
    type: 'Sick Leave',
    start: 'First Half',
    end: 'First Half',
    status: 'Pending',
  },
  {
    name: 'Jenny',
    type: 'Sick Leave',
    start: '15 July 2023',
    end: '15 July 2023',
    status: 'Pending',
  },
  {
    name: 'John',
    type: 'Casual Leave',
    start: '15 July 2023',
    end: '18 July 2023',
    status: 'Pending',
  },
  {
    name: 'Jack',
    type: 'Earned Leave',
    start: '20 July 2023',
    end: '23 July 2023',
    status: 'Pending',
  },
];

// dummy chart data
const chartSeries = [{ name: 'Total Leaves', data: [5, 8, 10, 15, 25, 12, 5] }];
const chartOptions = {
  chart: { height: 200, type: 'bar' },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  colors: ['#3f51b5'],
};

// Calendar Data
const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const calendarDays = [
  { date: '', type: 'empty' },
  { date: '26' },
  { date: '27' },
  { date: '28' },
  { date: '29' },
  { date: '30' },
  { date: '1', label: 'Sick', color: 'orange' },
  { date: '2' },
  { date: '3' },
  { date: '4' },
  { date: '5' },
  { date: '6', label: 'Holiday', color: 'red' },
  { date: '7' },
  { date: '8' },
];
</script>

<style scoped>
.empty {
  background-color: transparent;
}
</style>
