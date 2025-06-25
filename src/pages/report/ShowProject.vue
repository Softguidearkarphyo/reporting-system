<template>
  <BaseTitle>作業実績管理</BaseTitle>
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
      <BaseButton color="main">Excel</BaseButton>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import DatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
</script>
