<template>
  <BaseTitle class="mb-4"> {{ t('addMemberSkill.title') }} </BaseTitle>
  <Form ref="formRef" @submit="submit">
    <ParentCard class="pa-2">
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <Field name="name" v-slot="{ field }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.name')"
              class="mx-auto"
              :items="memberList"
              prependIcon="mdi-account"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="project" v-slot="{ field }">
            <BaseMultiselect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.project')"
              class="mx-auto"
              :items="project"
              prependIcon="mdi-microsoft-teams"
              :width="'320px'"
              item-title="name"
              item-value="id"
            >
            </BaseMultiselect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="position" v-slot="{ field }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.position')"
              class="mx-auto"
              :items="dedicatedPosition"
              prependIcon="mdi-account-supervisor"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="grade" v-slot="{ field }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.grade')"
              class="mx-auto"
              :items="grade"
              prependIcon="mdi-star"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="join_date" v-slot="{ field }">
            <BaseDatePicker
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.join_date')"
              class="mx-auto"
              prependIcon="mdi-calendar-month"
              :width="'320px'"
              :error-messages="errorMessage"
            ></BaseDatePicker>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="japanese_level" v-slot="{ field }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.japanese_level')"
              class="mx-auto"
              :items="japaneseLevel"
              prependIcon="mdi-ideogram-cjk"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseSelect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="sg_experience" v-slot="{ field }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.sg_experience')"
              class="mx-auto"
              type="number"
              prependIcon="mdi-weather-cloudy-clock"
              :width="'320px'"
            >
            </BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="prev_experience" v-slot="{ field }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.prev_experience')"
              class="mx-auto"
              type="number"
              prependIcon="mdi-history"
              :width="'320px'"
            >
            </BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="total_experience" v-slot="{ field }">
            <BaseTextField
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.total_experience')"
              class="mx-auto"
              prependIcon="mdi-clock-time-twelve"
              :width="'320px'"
              :readonly="true"
            >
            </BaseTextField>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="responsibility" v-slot="{ field }">
            <BaseMultiselect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.responsibility')"
              class="mx-auto"
              :items="responsibility"
              prependIcon="mdi-ideogram-cjk"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseMultiselect>
          </Field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <Field name="expertise" v-slot="{ field }">
            <BaseSelect
              v-model="field.value"
              v-bind="field"
              :label="t('addMemberSkill.form.expertise')"
              class="mx-auto"
              :items="skillList"
              prependIcon="mdi-ideogram-cjk"
              :width="'320px'"
              item-title="value"
              item-value="id"
            >
            </BaseSelect>
          </Field>
        </v-col>
      </v-row>
      <div class="mt-4 mb-4">
        <v-data-table
          hide-default-footer
          class="skill-table"
          style="width: 100%"
        >
          <template #body="{}">
            <tbody class="talbe-center">
              <tr v-for="(row, rowIndex) in chunkList" :key="rowIndex">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cell.text + cellIndex"
                  style="min-width: 100px; max-width: 130px"
                >
                  <div class="py-2 text-center">
                    <div>{{ cell.text }}</div>
                    <div style="position: relative">
                      <v-menu
                        v-model="openMenus[rowIndex][cellIndex]"
                        :close-on-content-click="false"
                        open-on-click
                        location="top"
                        offset-y
                      >
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            elevation="0"
                            class="mt-2 d-flex justify-center"
                            :style="{
                              backgroundColor: buttonBgColor,
                              padding: '5px',
                              width: '100%',
                            }"
                          >
                            <span class="font-weight-bold text-subtitle-1">
                              {{ cell.symbol }}
                            </span>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-text class="d-flex">
                            <BaseButton
                              v-for="(item, index) in symbols"
                              :key="index"
                              small
                              color="primary"
                              text
                              @click="
                                selectSymbol(item, cell, rowIndex, cellIndex)
                              "
                            >
                              {{ item }}
                            </BaseButton>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </div>
      <div class="d-flex justify-center">
        <BaseButton type="submit" style="width: 200px">
          {{ t('common.submit') }}
        </BaseButton>
      </div>
    </ParentCard>
  </Form>
</template>

<script setup>
import BaseMultiselect from '@/components/bases/BaseMultiselect.vue';
import {
  skillList,
  symbols,
  project,
  grade,
  dedicatedPosition,
  responsibility,
  japaneseLevel,
} from '@/utils/data';
import { useI18n } from 'vue-i18n';
import { useDisplay, useTheme } from 'vuetify';
import { watch } from 'vue';
import { useMemberStore } from '@/stores/member/member.js';
const formRef = ref(null);
const theme = useTheme();
const memberStore = useMemberStore();
const memberList = ref([]);
const fetch = async () => {
  await memberStore.fetchMember();
  const tmpMembers = memberStore.getMembers?.map((member) => ({
    id: member.id,
    value: member.eng_name,
  }));
  memberList.value = [...tmpMembers];
};

fetch();

const buttonBgColor = computed(() =>
  theme.global.name.value === 'dark' ? '#151A35' : '#ededed'
);

const { lgAndUp, mdAndUp } = useDisplay();
const { t } = useI18n();
const openMenus = reactive([]);
const skillSets = ref(
  skillList.map((text) => ({
    text,
    symbol: '-',
  }))
);
const cols = computed(() => {
  if (lgAndUp.value) return 13;
  else if (mdAndUp.value) return 9;
  else return 7;
});

const chunkList = computed(() => {
  const result = [];
  for (let i = 0; i < skillSets.value.length; i += cols.value) {
    result.push(skillSets.value.slice(i, i + cols.value));
  }
  return result;
});

function selectSymbol(action, cell, rowIndex, cellIndex) {
  openMenus[rowIndex][cellIndex] = false;
  cell.symbol = action;
}
const submit = async (values) => {
  const skills = skillSets.value.map(({ text, symbol }) => ({
    name: text,
    symbol: symbol,
  }));

  const payload = {
    ...values,
    skills,
  };
  console.log(payload, 'payload');
};

const updateTotal = () => {
  const values = formRef.value.values;
  const sg = Number(values.sg_experience || 0);
  const prev = Number(values.prev_experience || 0);
  formRef.value.setFieldValue('total_experience', sg + prev);
};

watch(() => formRef.value?.values?.sg_experience, updateTotal);
watch(() => formRef.value?.values?.prev_experience, updateTotal);

watchEffect(() => {
  openMenus.length = 0;
  chunkList.value.forEach((row) => {
    openMenus.push(row.map(() => false));
  });
});
</script>

<style scoped>
.talbe-center {
  display: table;
  margin: 0 auto;
}
.skill-table td {
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
  padding: 0;
}
.skill-table tbody tr td {
  padding: 8px 4px;
}
</style>
