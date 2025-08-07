<template>
  <v-data-table
    hide-default-footer
    class="skill-table"
    :items="[]"
    style="width: 100%; border-style: none"
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
                        width: '95%',
                      }"
                    >
                      <span class="font-weight-bold text-subtitle-1">
                        {{ cell.symbol }}
                      </span>
                    </v-btn>
                  </template>
                  <v-card v-if="editable">
                    <v-card-text class="d-flex">
                      <BaseButton
                        v-for="(item, index) in symbolLists"
                        :key="index"
                        small
                        color="primary"
                        text
                        @click="
                          selectSymbol(item.abbv, cell, rowIndex, cellIndex)
                        "
                      >
                        {{ item.abbv }}
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
</template>

<script setup>
import { useDisplay, useTheme } from 'vuetify';
const { lgAndUp, mdAndUp } = useDisplay();
import { useSystemStore } from '@/stores/system/system';

const props = defineProps({
  proficiencies: Array,
  editable: Boolean,
});
const systemStore = useSystemStore();
const techStackList = ref([]);
const symbolLists = ref([]);
const theme = useTheme();
const openMenus = ref([]);
const emit = defineEmits(['getSkills']);
const colsPerScreen = { lg: 13, md: 9, sm: 7 };
const cols = computed(() =>
  lgAndUp.value
    ? colsPerScreen.lg
    : mdAndUp.value
      ? colsPerScreen.md
      : colsPerScreen.sm
);
const fetch = async () => {
  await Promise.all([
    systemStore.fetchTechStacks(),
    systemStore.fetchProficiencyLevels(),
  ]);

  symbolLists.value =
    systemStore.getProficiencyLevels?.map((item) => ({
      id: item.id,
      abbv: item.abbv,
    })) ?? [];

  const techStacks = systemStore.getTechStacks;
  if (Array.isArray(techStacks)) {
    techStackList.value = techStacks.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }
};
onMounted(async () => {
  await fetch();
});
const skillSets = computed(() =>
  techStackList.value.map((skill) => {
    const matched = props.proficiencies?.find(
      (item) => item.tech_stack_id === skill.id
    );
    const symbol = symbolLists.value.find(
      (s) => s.id === matched?.proficiency_level_id
    )?.abbv;
    return {
      ...skill,
      symbol: symbol ?? '-',
      symbolId: matched?.proficiency_level_id ?? null,
    };
  })
);

const chunkList = computed(() => {
  const result = [];
  for (let i = 0; i < skillSets.value.length; i += cols.value) {
    result.push(skillSets.value.slice(i, i + cols.value));
  }
  return result;
});

watchEffect(() => {
  openMenus.value.length = 0;
  chunkList.value.forEach((row) => {
    openMenus.value.push(row.map(() => false));
  });
});
const buttonBgColor = computed(() =>
  theme.global.name.value === 'dark' ? '#151A35' : '#ededed'
);

const selectSymbol = (abbv, cell, rowIndex, cellIndex) => {
  openMenus.value[rowIndex][cellIndex] = false;
  cell.symbol = abbv;
  const matched = symbolLists.value.find((item) => item.abbv === abbv);
  cell.symbolId = matched?.id ?? null;

  const skills = skillSets.value.map(({ id, symbolId }) => ({
    tech_stack_id: id,
    proficiency_level_id: symbolId,
  }));
  emit('getSkills', skills);
};
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
