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
                prependIcon="mdi-ideogram-cjk"
                :width="'500px'"
                item-title="value"
                item-value="id"
              >
              </BaseSelect>
            </Field>
          </v-col>
        </v-row>
        <v-container fluid>
          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <Field name="name" v-slot="{ field }">
                <BaseSelect
                  v-model="selectedSymbol"
                  v-bind="field"
                  label="Select Symbol"
                  :items="symbols"
                  prependIcon="mdi-account"
                  :width="'320px'"
                  item-title="value"
                  item-value="id"
                >
                </BaseSelect>
              </Field>
            </v-col>
          </v-row>

          <div class="">
            <v-data-table
              hide-default-footer
              class="elevation-1 skill-table"
              style="width: 100%"
            >
              <template #body="{}">
                <tbody class="talbe-center">
                  <tr v-for="(row, rowIndex) in rows" :key="'row-' + rowIndex">
                    <td
                      v-for="cell in row"
                      :key="cell.text"
                      style="min-width: 100px; max-width: 130px"
                    >
                      <div class="py-2 text-center">
                        <div>{{ cell.text }}</div>
                        <v-btn
                          elevation="0"
                          class="mt-2 btn-color"
                          style="width: 100%; padding: 5px"
                          @click="changeFormula(cell)"
                        >
                          {{ cell.symbol }}
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </div>
          <v-row class="mt-4">
            <v-col cols="12" sm="4">
              <v-btn color="primary" @click="submitData"> Submit </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </ParentCard>
    </v-form>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const selectedSymbol = ref(null);
const symbols = ['-', 'O', '△', '×', 'C', 'CO'];

const skillList = [
  'JAVA',
  'C#',
  'PHP',
  'C++',
  'ASP.Net',
  'Access',
  'RoR',
  'ColdFusion',
  'VB6',
  'HTML5',
  'JavaScript',
  'Laravel',
  'jquery',
  'bootstrap',
  'Python',
  'Angular',
  'Vue',
  'Nuxt',
  'React',
  'Redis',
  'AWS S3',
  'Postgres',
  'DB2',
  'mySQL',
  'Oracle',
];

const skillListItem = ref(
  skillList.map((text) => ({
    text,
    symbol: '',
  }))
);

const cols = 13;

const rows = computed(() => {
  const result = [];
  for (let i = 0; i < skillListItem.value.length; i += cols) {
    result.push(skillListItem.value.slice(i, i + cols));
  }
  return result;
});

function changeFormula(cell) {
  console.log(cell, 'cell');

  if (selectedSymbol.value != null) {
    cell.symbol = selectedSymbol.value;
  }
}
// function submitData() {
//   const result = skillListItem.value.map(({ text, symbol }) => ({
//     technology: text,
//     symbol: symbol,
//   }));

//   console.log('Submitted data:', result);
// }
</script>
<style scoped>
.skill-table th,
.skill-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 0;
}
.skill-table tbody tr td {
  padding: 8px 4px;
}
.v-btn {
  background-color: #ededed;
}
</style>
