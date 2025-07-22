<template>
  <v-bottom-sheet v-model="modelValue">
    <v-card>
      <v-card-title class="text-h6 d-flex flex-column">
        Skill Sheet
        <h3 class="text-subtitle-2 mt-1">{{ staffName }}</h3>
      </v-card-title>
      <v-card-text>
        <v-data-table
          hide-default-footer
          class="skill-table"
          :items="[]"
          style="width: 100%"
        >
          <template #body>
            <tbody class="table-center">
              <tr v-for="(row, rowIndex) in chunkList" :key="rowIndex">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="`${cell.name}-${cellIndex}`"
                  style="min-width: 100px; max-width: 130px"
                >
                  <div class="py-2 text-center">
                    <div>{{ cell.name }}</div>
                    <v-btn
                      elevation="0"
                      class="mt-2 d-flex justify-center"
                      :style="{
                        backgroundColor: buttonBgColor,
                        padding: '5px',
                        width: '100%',
                        cursor: 'default',
                      }"
                    >
                      <span class="font-weight-bold text-subtitle-1">
                        {{ cell.symbol || '-' }}
                      </span>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSkillSheetStore } from '@/stores/skillSheet/skillSheet';
import { useSystemStore } from '@/stores/system/system';

const modelValue = defineModel();
const props = defineProps({ id: Number });

const skillSheetStore = useSkillSheetStore();
const systemStore = useSystemStore();

const techStackList = ref([]);
const symbolLists = ref([]);
const staffName = ref('');
const fetchedSkillSheet = ref(null);
const cols = ref(13);
const buttonBgColor = '#f4f4f4';

const initData = async () => {
  await Promise.all([
    systemStore.fetchTechStacks(),
    systemStore.fetchProficiencyLevels(),
  ]);
  techStackList.value = systemStore.getTechStacks.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  symbolLists.value = systemStore.getProficiencyLevels.map((item) => ({
    id: item.id,
    abbv: item.abbv,
  }));
};

initData();

const fetchSkillSheet = async () => {
  if (!props.id) return;
  const res = await skillSheetStore.fetchSkillSheet({ id: props.id });
  const data = res?.data?.[0];
  fetchedSkillSheet.value = res?.data?.[0] ?? null;
  staffName.value = data?.staff?.eng_name ?? '';
};

watch(
  () => modelValue.value,
  (isOpen) => {
    if (isOpen) fetchSkillSheet();
  }
);
const skillSets = computed(() => {
  return techStackList.value.map((skill) => {
    const matched = fetchedSkillSheet.value?.tech_stack_proficiencies?.find(
      (item) => item.tech_stack_id === skill.id
    );
    const symbol = symbolLists.value.find(
      (s) => s.id === matched?.proficiency_level_id
    )?.abbv;
    return {
      ...skill,
      symbol: symbol ?? '-',
    };
  });
});

const chunkList = computed(() => {
  const result = [];
  for (let i = 0; i < skillSets.value.length; i += cols.value) {
    result.push(skillSets.value.slice(i, i + cols.value));
  }
  return result;
});
</script>
<style scoped>
.table-center {
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
