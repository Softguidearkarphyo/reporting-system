<template>
  <v-container>
    <BaseTitle class="mb-4"> {{ t('addMemberSkill.title') }} </BaseTitle>
    <v-form ref="staffForm" v-model="formValid">
      <!-- Basic Info Section -->
      <ParentCard class="pa-4 mb-4">
        <!-- <v-card-title>Staff Information</v-card-title> -->
        <v-row>
          <v-col cols="12" md="6" lg="4">
            <Field name="name" v-slot="{ field }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('addMemberSkill.form.name')"
                class="mx-auto"
                :items="sortKey"
                prependIcon="mdi-account"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="role" v-slot="{ field }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('addMemberSkill.form.role')"
                class="mx-auto"
                :items="sortKey"
                prependIcon="mdi-account-supervisor"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="team" v-slot="{ field }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('addMemberSkill.form.team')"
                class="mx-auto"
                :items="sortKey"
                prependIcon="mdi-microsoft-teams"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="permanent_date" v-slot="{ field }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('addMemberSkill.form.permanent_date')"
                class="mx-auto"
                :items="sortKey"
                prependIcon="mdi-calendar-month"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="experience" v-slot="{ field }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('addMemberSkill.form.experience')"
                class="mx-auto"
                :items="sortKey"
                prependIcon="mdi-weather-cloudy-clock"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <Field name="japanese_level" v-slot="{ field }">
              <BaseSelect
                v-model="field.value"
                v-bind="field"
                :label="t('addMemberSkill.form.japanese_level')"
                class="mx-auto"
                :items="sortKey"
                prependIcon="mdi-ideogram-cjk"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
        </v-row>
      </ParentCard>

      <!-- Skills Section -->
      <v-card class="pa-4 mb-4">
        <v-card-title>Skills</v-card-title>
        <v-table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Skill</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(skills, category) in form.skills" :key="category">
              <tr v-for="(level, skill) in skills" :key="skill">
                <td>{{ category }}</td>
                <td>{{ skill }}</td>
                <!-- <td>
                  <v-radio-group
                    v-model="form.skills[category][skill]"
                    class="d-flex flex-row"
                  >
                    <v-radio class="mr-4" label="◯" value="◯" />
                    <v-radio class="mr-4" label="△" value="△" />
                    <v-radio class="mr-4" label="□" value="□" />
                  </v-radio-group>
                </td> -->

                <td>
                  <v-radio-group
                    v-model="form.skills[category][skill]"
                    class="radio-grid"
                  >
                    <v-radio label="◯112" value="◯11" />
                    <v-radio label="△" value="△" />
                    <v-radio label="□" value="□" />
                  </v-radio-group>
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>

      <!-- Submit Button -->
      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="!formValid"
      >
        Submit
      </v-btn>

      <!-- Feedback -->
      <v-alert type="success" v-if="success" class="mt-4"
        >Submitted successfully!</v-alert
      >
      <v-alert type="error" v-if="error" class="mt-4"
        >Error: {{ error }}</v-alert
      >
    </v-form>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { position, role, sortKey, project } from '@/utils/data';
import { useMemberStore } from '@/stores/member/member.js';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const { t } = useI18n();
import axios from 'axios';

const formValid = ref(true);
const loading = ref(false);
const success = ref(false);
const error = ref('');

const rules = {
  required: (v) => !!v || 'Required',
};

const form = reactive({
  name: '',
  role: '',
  team: '',
  joinedYear: '',
  experience: '',
  japanese_level: '',
  skills: {
    Programming: { Java: '', PHP: '', Python: '' },
    Frontend: { Vue: '', React: '', Angular: '' },
    Backend: { Laravel: '', NodeJS: '' },
    Database: { MySQL: '', PostgreSQL: '', Oracle: '' },
    Cloud: { 'AWS S3': '', Azure: '' },
  },
});

// const handleSubmit = async () => {
//   loading.value = true;
//   success.value = false;
//   error.value = '';

//   try {
//     const response = await axios.post('/api/staff', form);
//     success.value = true;
//   } catch (err) {
//     error.value = err?.response?.data?.message || 'Failed to submit';
//   } finally {
//     loading.value = false;
//   }
// };
</script>
<style>
.radio-grid {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 1rem;
  justify-content: start;
  align-items: center;
}
</style>
