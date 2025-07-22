<template>
  <v-container>
    <BaseTitle>MenPower</BaseTitle>
    <v-text-field label="test"></v-text-field>
    <v-text-field label="test"></v-text-field>
    <v-text-field label="test"></v-text-field>
    <BaseButton>submit</BaseButton>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
</script>
