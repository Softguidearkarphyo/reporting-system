<template>
  <BaseTitle>Report</BaseTitle>
  <v-row
    class="d-flex align-center"
    justify="start"
    no-gutters
    style="gap: 16px"
  >
    <v-col cols="12" md="3">
      <DatePicker
        label="Start Date"
        :style="{ width: '100%' }"
        :is-hide-details="true"
        customClass="mt-2"
      />
    </v-col>

    <v-col cols="12" md="3">
      <DatePicker
        label="End Date"
        :style="{ width: '100%' }"
        :is-hide-details="true"
        customClass="mt-2"
      />
    </v-col>

    <v-col cols="12" md="3">
      <BaseButton class="btn-color" color="secondary">submit</BaseButton>
      <BaseButton class="btn-color">CSV</BaseButton>
      <BaseButton color="secondary">Excel</BaseButton>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import DatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
</script>
<style scoped>
.btn-color {
  /* background: linear-gradient(-90deg, #70e000, #ccff33) !important; */
  background: linear-gradient(90deg, #f186c0, #fbe2f0) !important;

  color: #ffffff !important;
}
</style>
