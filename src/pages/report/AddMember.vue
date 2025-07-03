<template>
  <v-container>
    <BaseTitle class="mb-4"> 作業実績管理の会員登録 </BaseTitle>
    <ParentCard class="pa-6">
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-row class="px-4 py-4">
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="engName"
              name="eng_name"
              label="English Name"
              type="text"
              variant="plain"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="jpName"
              name="jpName"
              label="Japanese Name"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="username"
              name="username"
              label="Username"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="password"
              name="password"
              label="Password"
              type="password"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="address"
              name="address"
              label="Address"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="ph_number"
              name="ph_number"
              label="Phone Number"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseSelect
              v-model="selectedPosition"
              name="selectedPosition"
              label="Position"
              :items="position"
              prependIcon="mdi-account"
              item-title="name"
              :width="'320px'"
              item-value="id"
            >
            </BaseSelect>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseSelect
              v-model="selectedRole"
              name="selectedRole"
              label="Role"
              :items="role"
              prependIcon="mdi-account"
              item-title="name"
              :width="'320px'"
              item-value="id"
            >
            </BaseSelect>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="email"
              name="email"
              label="Email"
              type="email"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseDatePicker
              v-model="selectedDate"
              name="perment_date"
              label="Permanet Date"
              prependIcon="mdi-calendar-month"
              :width="'320px'"
              required
            ></BaseDatePicker>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="ref_person"
              name="ref_person"
              label="Ref Person"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseTextField
              v-model="ref_ph_number"
              name="ref_ph_number"
              label="Ref Phone Number"
              type="text"
              variant="plain"
              dense
              autocomplete="test"
              prependIcon="mdi-account"
              :width="'320px'"
              hide-details
              required
            ></BaseTextField>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseSelect
              v-model="selectedProject"
              name="project"
              label="Project"
              :items="project"
              prependIcon="mdi-account"
              :width="'320px'"
              item-title="name"
              item-value="id"
            >
            </BaseSelect>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <BaseSelect
              v-model="selectedSortKey"
              name="sort_key"
              label="Sort Key"
              :items="sortKey"
              prependIcon="mdi-account"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseSelect>
          </v-col>
          <v-col cols="12" lg="4">
            <div
              class="d-flex justify-end"
              :style="width > 1280 ? 'width: 320px' : ''"
            >
              <BaseButton type="submit" style="width: 200px">
                Submit
              </BaseButton>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </ParentCard>
  </v-container>
</template>
<script setup>
import { position, role, sortKey, project } from '@/utils/data';
import { useDisplay } from 'vuetify';
import { useMemberStore } from '@/stores/member/member.js';
const { width } = useDisplay();
const memberStore = useMemberStore();
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
const handleSubmit = async () => {
  const payload = {
    eng_name: engName.value,
    jp_name: jpName.value,
    username: username.value,
    password: password.value,
    address: address.value,
    ph_number: ph_number.value,
    position: selectedPosition.value,
    role: selectedRole.value,
    email: email.value,
    perment_date: new Date(selectedDate.value).toISOString().slice(0, 10),
    ref_person: ref_person.value,
    ref_ph_number: ref_ph_number.value,
    project: selectedProject.value,
    sort_key: selectedSortKey.value,
  };

  await memberStore.createMember(payload);
};
</script>
<style scoped></style>
