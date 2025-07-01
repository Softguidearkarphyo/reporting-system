<template>
  <div>
    <BaseTitle>Member List</BaseTitle>
    <ParentCard>
      <v-row>
        <v-col cols="12" md="4">
          <BaseTextField
            label="test"
            type="text"
            variant="plain"
            dense
            autocomplete="test"
            prependIcon="mdi-account"
            hide-details
            :rules="rules"
            required
          ></BaseTextField>
        </v-col>
        <v-col cols="12" md="4">
          <BaseMultiselect
            :items="['Red', 'Green', 'Blue']"
            label="test"
            prependIcon="mdi-account"
            :rules="rules"
            required
          ></BaseMultiselect>
        </v-col>
        <v-col cols="12" md="4">
          <BaseDatePicker
            label="test"
            prependIcon="mdi-calendar-month"
            :rules="rules"
            required
          ></BaseDatePicker>
        </v-col>

        <v-col cols="12" class="d-flex gap-4">
          <BaseButton type="submit">Test</BaseButton>
          <BaseButton type="reset">Test</BaseButton>
        </v-col>
      </v-row>
    </ParentCard>
  </div>
</template>
<script setup>
import BaseTitle from '../../components/bases/BaseTitle.vue';
import BaseTextField from '../../components/bases/BaseTextField.vue';
import ParentCard from '../../components/card/ParentCard.vue';
import BaseDatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseMultiselect from '../../components/bases/BaseMultiselect.vue';
import BaseButton from '../../components/bases/BaseButton.vue';
</script>
