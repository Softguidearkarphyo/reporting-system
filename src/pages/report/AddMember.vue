<template>
  <v-container>
    <ParentCard style="max-width: 90%" class="mx-auto">
      <BaseTitle class="text-center"> 作業実績管理の会員登録 </BaseTitle>
      <div style="max-width: 80%; width: 100%" class="mx-lg-auto">
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-row class="px-4 py-4">
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="engName"
                name="eng_name"
                label="English Name"
                type="text"
                variant="plain"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="jpName"
                name="jpName"
                label="Japanese Name"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="username"
                name="username"
                label="Username"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="password"
                name="password"
                label="Password"
                type="password"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="address"
                name="address"
                label="Address"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="ph_number"
                name="ph_number"
                label="Phone Number"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseSelect
                v-model="selectedPosition"
                name="selectedPosition"
                label="Position"
                :items="position"
                prependIcon="mdi-account"
                item-title="name"
                :width="'360px'"
                item-value="id"
              >
              </BaseSelect>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseSelect
                v-model="selectedRole"
                name="selectedRole"
                label="Role"
                :items="role"
                prependIcon="mdi-account"
                item-title="name"
                :width="'360px'"
                item-value="id"
              >
              </BaseSelect>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="email"
                name="email"
                label="Email"
                type="email"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseDatePicker
                v-model="selectedDate"
                name="perment_date"
                label="Permanet Date"
                prependIcon="mdi-calendar-month"
                :width="'360px'"
                required
              ></BaseDatePicker>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="ref_person"
                name="ref_person"
                label="Ref Person"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseTextField
                v-model="ref_ph_number"
                name="ref_ph_number"
                label="Ref Phone Number"
                type="text"
                variant="plain"
                dense
                autocomplete="test"
                prependIcon="mdi-account"
                :width="'360px'"
                hide-details
                required
              ></BaseTextField>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseSelect
                v-model="selectedProject"
                name="project"
                label="Project"
                :items="role"
                prependIcon="mdi-account"
                :width="'360px'"
                item-title="name"
                item-value="id"
              >
              </BaseSelect>
            </v-col>
            <v-col cols="12" lg="6" xl="6" class="d-flex justify-center">
              <BaseSelect
                v-model="selectedSortKey"
                name="sort_key"
                label="Sort Key"
                :items="sortKey"
                prependIcon="mdi-account"
                :width="'360px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </v-col>
            <v-col>
              <div class="d-flex mx-8 justify-end">
                <BaseButton type="submit" style="width: 200px">
                  LOGIN
                </BaseButton>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </ParentCard>
  </v-container>
</template>
<script setup>
import BaseTextField from '../../components/bases/BaseTextField.vue';
import ParentCard from '../../components/card/ParentCard.vue';
import BaseDatePicker from '../../components/bases/BaseDatePicker.vue';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
import { useToast } from 'vue-toastification';
import { position, role, sortKey } from '@/utils/data';
const toast = useToast();
const engName = ref('');
const jpName = ref('');
const username = ref('');
const password = ref('');
const address = ref('');
const ph_number = ref(null);
const selectedPosition = ref(null);
const selectedRole = ref(null);
const email = ref(null);
const selectedDate = ref(null);
const ref_person = ref('');
const ref_ph_number = ref(null);
const selectedProject = ref('');
const selectedSortKey = ref(null);
const handleSubmit = () => {
  const payload = {
    engName: engName.value,
    jpName: jpName.value,
    username: username.value,
    password: password.value,
    engName: engName.value,
    address: address.value,
    selectedPosition: selectedPosition.value,
    selectedRole: selectedRole.value,
    email: email.value,
    selectedDate: selectedDate.value,
    ref_person: ref_person.value,
    ref_ph_number: ref_ph_number.value,
    selectedProject: selectedProject.value,
    selectedSortKey: selectedSortKey.value,
  };
  console.log(payload, 'click');
};
</script>
<style scoped></style>
