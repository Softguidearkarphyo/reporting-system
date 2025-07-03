<template>
  <v-container>
    <BaseTitle class="mb-4"> 作業実績管理の会員登録 </BaseTitle>
    <ParentCard class="pa-6">
      <Form
        ref="formRef"
        :validation-schema="memberCreateSchema"
        @submit="submit"
        v-slot="{ meta }"
      >
        <v-row class="mx-auto px-4 py-4">
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="eng_name" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.eng_name')"
                type="text"
                variant="plain"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="jp_name" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.jp_name')"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="username" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.username')"
                type="text"
                variant="plain"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="password" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.password')"
                type="password"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="address" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.address')"
                type="text"
                variant="plain"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" class="justify-center" md="6" lg="4">
            <Field name="ph_number" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.ph_number')"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="position" v-slot="{ field, errorMessage }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('form.position')"
                :items="position"
                prependIcon="mdi-account"
                item-title="name"
                :width="'320px'"
                item-value="id"
                :error-messages="errorMessage"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="role" v-slot="{ field, errorMessage }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('form.role')"
                :items="role"
                prependIcon="mdi-account"
                item-title="name"
                :width="'320px'"
                item-value="id"
                :error-messages="errorMessage"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="email" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.email')"
                type="email"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="permanent_date" v-slot="{ field, errorMessage }">
              <BaseDatePicker
                v-bind="field"
                :label="t('form.permanent_date')"
                prependIcon="mdi-calendar-month"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseDatePicker>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="ref_person" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.ref_person')"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="ref_ph_number" v-slot="{ field, errorMessage }">
              <BaseTextField
                v-bind="field"
                :label="t('form.ref_ph_number')"
                name="ref_ph_number"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'320px'"
                :error-messages="errorMessage"
              ></BaseTextField>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="project" v-slot="{ field, errorMessage }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('form.project')"
                :items="project"
                prependIcon="mdi-account"
                :width="'320px'"
                item-title="name"
                item-value="id"
                :error-messages="errorMessage"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="sort_key" v-slot="{ field, errorMessage }">
              <BaseSelect
                v-model="field.sort_key"
                v-bind="field"
                :label="t('form.sort_key')"
                :items="sortKey"
                prependIcon="mdi-account"
                :width="'320px'"
                item-title="value"
                item-value="id"
                :error-messages="errorMessage"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col class="justify-center" cols="12" lg="4">
            <div
              class="d-flex justify-center"
              :style="width > 1280 ? 'width: 320px' : ''"
            >
              <BaseButton
                :disabled="!meta.valid"
                type="submit"
                style="width: 200px"
              >
                Submit
              </BaseButton>
            </div>
          </v-col>
        </v-row>
      </Form>
    </ParentCard>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';
import { position, role, sortKey, project } from '@/utils/data';
import { useDisplay } from 'vuetify';
import { useMemberStore } from '@/stores/member/member.js';
import { useI18n } from 'vue-i18n';
import { getMemberCreateSchema } from '@/plugins/validations/common-validations';
const { t } = useI18n();
const memberCreateSchema = computed(() => getMemberCreateSchema(t));
const memberStore = useMemberStore();
const { width } = useDisplay();

const formRef = ref(null);
const submit = async (values) => {
  console.log('Form submitted:', values);
  await memberStore.createMember(values);
  formRef.value?.resetForm();
};
</script>
