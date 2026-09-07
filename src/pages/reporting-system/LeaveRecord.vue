<template>
  <v-container>
    <v-main class="pa-4">

      <!-- Top Summary Cards -->
      <v-row class="mb-4" dense>
        <v-col
          v-for="(type, i) in leaveTypes"
          :key="i"
          cols="6"
          md="2"
        >
          <v-card class="pa-3 rounded-lg" elevation="2">
            <div class="text-center">
              <div class="text-h6 font-weight-bold">{{ type.remaining }}</div>
              <div class="text-caption">{{ type.name }}</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Section -->
      <v-row dense>

        <!-- LEFT: Today + Yesterday Leave -->
        <v-col cols="12" md="6">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="text-h6">
              Leave List (Today & Yesterday)
            </v-card-title>

            <v-divider />

            <v-data-table
              :headers="leftHeaders"
              :items="recentLeaves"
              density="compact"
            >
              <template #item.status="{ item }">
                <v-chip size="small" color="warning">
                  {{ item.status }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <!-- RIGHT: Most Leave (30 months) -->
        <v-col cols="12" md="6">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="text-h6">
              Most Leave (Last 30 Months)
            </v-card-title>

            <v-divider />

            <v-data-table
              :headers="rightHeaders"
              :items="topLeaves"
              density="compact"
            >
              <template #item.total="{ item }">
                <strong>{{ item.total }} days</strong>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

      </v-row>

    </v-main>
  </v-container>
</template>

<script setup>
/* leave summary */
const leaveTypes = [
  { name: 'Sick', remaining: 8 },
  { name: 'Casual', remaining: 6 },
  { name: 'Earned', remaining: 10 },
  { name: 'Annual', remaining: 12 },
]

/* LEFT TABLE */
const leftHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Date', key: 'date' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'status' },
]

const recentLeaves = [
  { name: 'Jessica', date: 'Today', type: 'Sick', status: 'Pending' },
  { name: 'John', date: 'Today', type: 'Casual', status: 'Approved' },
  { name: 'Jenny', date: 'Yesterday', type: 'Earned', status: 'Pending' },
]

/* RIGHT TABLE */
const rightHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Department', key: 'dept' },
  { title: 'Total Leaves', key: 'total' },
]

const topLeaves = [
  { name: 'Jack', dept: 'HR', total: 42 },
  { name: 'Emma', dept: 'IT', total: 38 },
  { name: 'John', dept: 'Finance', total: 35 },
]
</script>

<style scoped>
.v-card {
  border-radius: 14px;
}
</style>