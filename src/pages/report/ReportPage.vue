<template>
  <v-row
    class="d-flex align-center"
    justify="start"
    no-gutters
    style="gap: 16px"
  >
    <v-col cols="12" md="3">
      <DatePicker
        v-model="startDate"
        label="Start Date"
        :style="{ width: '100%' }"
        :is-hide-details="true"
        customClass="mt-2"
      />
    </v-col>

    <v-col cols="12" md="3">
      <DatePicker
        v-model="endDate"
        label="End Date"
        :style="{ width: '100%' }"
        :is-hide-details="true"
        customClass="mt-2"
      />
    </v-col>

    <v-col cols="12" md="3">
      <v-btn color="primary" class="mt-4"> Submit </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import DatePicker from '../../components/bases/BaseDatePicker.vue';
</script>
