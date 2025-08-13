<template>
  <v-row class="align-center mb-3">
    <v-col cols="6" md="7" lg="9" class="d-flex justify-start">
      <BaseTitle> {{ t('addMemberSkill.employee_competency') }} </BaseTitle>
    </v-col>
    <v-col cols="6" md="5" lg="3" class="d-flex justify-end">
      <BaseTextField
        v-model="search"
        :label="t('common.search')"
        color="primary"
        prepend-icon="mdi-magnify"
        type="text"
        variant="plain"
        dense
        autocomplete="test"
      >
      </BaseTextField>
    </v-col>
    <v-col class="text-end">
      <BaseButton
        @click="exportFile"
        :disabled="!items.length"
        style="width: 200px"
      >
        Export
      </BaseButton>
    </v-col>
  </v-row>
  <ParentCard>
    <BaseTable :headers="headers" :items="items">
      <template #[`item.action`]="{ item }">
        <span class="d-flex justify-center p-0">
          <BaseButton
            elevation="0"
            @click="viewSkillSheet(item.id)"
            color=""
            class="edit-btn"
            size="small"
            :style="{ width }"
          >
            <v-icon icon="tabler:IconTarget" size="15" />
          </BaseButton>
          <BaseButton
            elevation="0"
            @click.stop="pushToEdit(item.id)"
            color=""
            class="edit-btn"
            size="small"
            :style="{ width }"
          >
            <v-icon icon="tabler:IconEdit" size="15" />
          </BaseButton>
        </span>
      </template>
    </BaseTable>
  </ParentCard>
  <v-bottom-sheet v-model="showSheet">
    <v-card>
      <v-card-title class="text-h6 d-flex flex-column">
        Skill Sheet
        <h3 class="text-subtitle-2 mt-1">{{ staffName }}</h3>
      </v-card-title>
      <v-card-text>
        <SkillTable
          :proficiencies="fetchedSkillSheet?.tech_stack_proficiencies || []"
          :editable="false"
        />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { exportExcel } from '@/excel-export/skillsheet/excel';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSkillSheetStore } from '@/stores/skillSheet/skillSheet';
import { useSystemStore } from '@/stores/system/system';
const { t, locale } = useI18n();
const skillSheetStore = useSkillSheetStore();
const router = useRouter();
const search = ref('');
const items = ref([]);
const fetchedSkillSheet = ref(null);
const width = '30px';
const showSheet = ref(false);
const staffName = ref('');
const techStackList = ref([]);
const systemStore = useSystemStore();
let originalItems = [];
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('addMemberSkill.table.staff').toUpperCase(),
      key: 'staff',
    },

    {
      title: t('addMemberSkill.table.position'),
      key: 'position',
      sortable: false,
    },
    {
      title: t('addMemberSkill.table.grade'),
      key: 'grade',
      sortable: false,
    },
    {
      title: t('addMemberSkill.table.join_date'),
      key: 'join_date',
      sortable: false,
    },
    {
      title: t('addMemberSkill.table.japanese_level'),
      key: 'japanese_level',
      sortable: false,
    },
    {
      title: t('addMemberSkill.table.responsibility'),
      key: 'responsibility',
      sortable: false,
    },
    {
      title: t('addMemberSkill.table.major_tech_stack'),
      key: 'major_tech_stack',
      sortable: false,
    },
    {
      title: t('addMemberSkill.table.action'),
      key: 'action',
      align: 'center',
      sortable: false,
      width: '10%',
    },
  ];
  return tmpHeaders.map((header) => ({
    ...header,
    title: header.title.toUpperCase(),
  }));
});

const fetch = async () => {
  await systemStore.fetchTechStacks(), await skillSheetStore.fetchSkillSheet();

  const tmpArr = skillSheetStore.getSkillSheets?.map((item) => ({
    id: item.id,
    staff: item?.staff?.username,
    project:
      item?.staff_project.map((p) => p.project?.eng_name).join(', ') ?? [],
    position: item?.position?.name,
    grade: item?.grade?.name,
    join_date: item?.join_date,
    sg_experience: item?.sg_experience,
    prev_experience: item?.prev_experience,
    total_experience: item?.total_experience,
    japanese_level: item?.japanese_level?.name,
    responsibility:
      item?.staff_responsibility
        .map((p) => p.responsibility?.name)
        .join(', ') ?? [],
    major_tech_stack: item?.major_tech_stack?.name,
  }));

  items.value = [...tmpArr];
  originalItems = [...items.value];

  techStackList.value =
    systemStore?.getTechStacks?.map((item) => item?.name) ?? [];
};

onMounted(async () => {
  await fetch();
});

const viewSkillSheet = async (id) => {
  const res = await skillSheetStore.fetchSkillSheet({ id });
  fetchedSkillSheet.value = res?.data?.[0] ?? null;
  const data = fetchedSkillSheet.value;
  staffName.value = data?.staff?.eng_name ?? '';
  showSheet.value = true;
};

const pushToEdit = (id) => {
  router.push({ name: 'edit-employee-skill', params: { skillSheetId: id } });
};
const exportFile = () => {
  exportExcel(skillSheetStore.getSkillSheets, techStackList.value);
};
watch(
  () => search.value,
  (newVal) => {
    if (newVal) {
      items.value = originalItems.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(newVal.toLowerCase())
        )
      );
    } else {
      items.value = [...originalItems];
    }
  }
);
</script>
<style>
.small-text-field label {
  font-size: 13px;
}
</style>
