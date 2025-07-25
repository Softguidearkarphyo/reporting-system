<template>
  <BaseTitle>Member Report</BaseTitle>
  <v-row
    class="d-flex align-center"
    justify="start"
    no-gutters
    style="gap: 16px"
  >
    <v-col cols="12" md="3">
      <DatePicker
        label="検索期間"
        :style="{ width: '100%' }"
        :is-hide-details="true"
        customClass="mt-2"
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        label="レンジ"
        :items="[
          'Jhon Doe',
          'Michael Thar Sit',
          'Banana',
          'Sithu Plug kyut',
          'DJ Moon',
          'Hla Htay',
        ]"
      ></v-select>
    </v-col>

    <v-col cols="12" md="3">
      <BaseButton>submit</BaseButton>
      <BaseButton>excel</BaseButton>
    </v-col>
  </v-row>
</template>

<script setup>
import DatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
</script>
<style>
::v-deep(.v-card) {
  background-color: white !important;
}
</style>
