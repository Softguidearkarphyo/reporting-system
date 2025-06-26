<template>
  <BaseTitle>Member List</BaseTitle>
  <v-row>
    <v-col col="6">
      <ParentCard>
        <BaseTextField
          label="test"
          type="text"
          variant="plain"
          dense
          autocomplete="test"
          prependIcon="mdi-account"
          hide-details
        ></BaseTextField>
        <BaseMultiselect prependIcon="mdi-account"></BaseMultiselect>
        <BaseButton>Test</BaseButton>
      </ParentCard>
    </v-col>
    <v-col col="6">
      <ParentCard>
        <BaseTextField
          label="test"
          type="text"
          variant="plain"
          dense
          autocomplete="test"
          prependIcon="mdi-account"
          hide-details
        ></BaseTextField>
        <BaseMultiselect prependIcon="mdi-account"></BaseMultiselect>
        <BaseButton>Test</BaseButton>
      </ParentCard>
    </v-col>
  </v-row>
  <ParentCard>
    <BaseTextField
      label="test"
      type="text"
      variant="plain"
      dense
      autocomplete="test"
      prependIcon="mdi-account"
      hide-details
    ></BaseTextField>
    <BaseMultiselect prependIcon="mdi-account"></BaseMultiselect>
    <BaseButton>Test</BaseButton>
  </ParentCard>
</template>
<script setup>
import BaseTitle from '../../components/bases/BaseTitle.vue';
import BaseTextField from '../../components/bases/BaseTextField.vue';
import ParentCard from '../../components/card/ParentCard.vue';

import BaseMultiselect from '../../components/bases/BaseMultiselect.vue';
import BaseButton from '../../components/bases/BaseButton.vue';
</script>
