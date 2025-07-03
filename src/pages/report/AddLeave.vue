<template>
  <Form
    :validation-schema="memberCreateSchema"
    @submit="submit"
    v-slot="{ meta }"
  >
    <div class="mb-4">
      <Field name="eng_name" v-slot="{ field, errorMessage }">
        <v-text-field
          v-bind="field"
          :error-messages="errorMessage"
          label="English Name"
          data-testid="eng-name-field"
        />
      </Field>
    </div>

    <div class="mb-4">
      <Field name="jp_name" v-slot="{ field, errorMessage }">
        <v-text-field
          v-bind="field"
          :error-messages="errorMessage"
          label="Japanese Name"
          data-testid="jp-name-field"
        />
      </Field>
    </div>

    <v-btn type="submit" color="primary" :disabled="!meta.valid" class="mt-4">
      Submit
    </v-btn>
  </Form>
</template>

<script setup>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import { getMemberCreateSchema } from '@/plugins/validations/common-validations';

const memberCreateSchema = yup.object({
  eng_name: yup.string().required('English name is required'),
  jp_name: yup.string().required('Japanese name is required'),
});

const submit = (values) => {
  console.log('Form submitted:', values);
  alert(JSON.stringify(values, null, 2));
};
</script>

<style scoped>
.debug-info {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
  margin-bottom: 1rem;
}
</style>
