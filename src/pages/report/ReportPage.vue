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
      <BaseButton color="main">submit</BaseButton>
      <BaseButton color="main">CSV</BaseButton>
      <BaseButton color="main">Excel</BaseButton>
    </v-col>
  </v-row>
</template>

<script setup>
import DatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
</script>
<style scoped></style>
