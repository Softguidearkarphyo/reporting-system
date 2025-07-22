<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-3 mt-n3">
      <BaseTitle>{{ t('addMemberSkill.employee_competency') }}</BaseTitle>
      <div style="width: 300px">
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          type="text"
          variant="plain"
          dense
          autocomplete="test"
          prependIcon="mdi-magnify"
          :width="'300px'"
        ></BaseTextField>
      </div>
    </div>
    <ParentCard>
      <BaseTable
        :headers="headers"
        :items="items"
        :height="windowHeight"
        :items-count="itemsCount"
      >
        <template #item.action="{ item }">
          <span class="d-flex justify-center p-0">
            <BaseButton
              elevation="0"
              @click.stop="pushToEdit(item.id)"
              color=""
              class="edit-btn"
              size="small"
              :style="{ width }"
            >
              <v-icon icon="tabler:IconEdit" size="20" color="primary" />
            </BaseButton>
            <BaseButton
              elevation="0"
              @click.stop="showConfirmDelete(item.id)"
              color=""
              class="delete-btn"
              size="small"
              :style="{ width }"
            >
              <v-icon
                icon="tabler:IconTrash"
                size="20"
                style="color: #ff0000"
              />
            </BaseButton>
          </span>
        </template>
      </BaseTable>
    </ParentCard>
    <BaseConfirmDelete
      v-model="confirmDelete"
      :text="t('memberList.deleteConfirmText')"
      :class="{ 'd-none': !confirmDelete }"
      @yes="
        confirmDelete = false;
        deleteMember();
      "
      @no="
        confirmDelete = false;
        deleteTarget = undefined;
      "
    ></BaseConfirmDelete>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSkillSheetStore } from '@/stores/skillSheet/skillSheet';
import { responsibility } from '@/utils/data';

const { t, locale } = useI18n();
const skillSheetStore = useSkillSheetStore();
const router = useRouter();
const confirmDelete = ref(false);
const deleteTarget = ref(undefined);
const search = ref('');
const items = ref([]);
const width = '30px';
const fallbackColor = { id: undefined, name: 'others', color: '#B7410E50' };
let originalItems = [];
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('addMemberSkill.table.staff').toUpperCase(),
      key: 'staff',
    },
    {
      title: t('addMemberSkill.table.project'),
      key: 'project',
      align: 'center',
      sortable: false,
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
let windowHeight, itemsCount;
if (window.innerWidth > 1366) {
  windowHeight = window.innerHeight / 1.4;
  itemsCount = 10;
} else {
  windowHeight = window.innerHeight / 1.8;
  itemsCount = 5;
}

const fetch = async () => {
  await skillSheetStore.fetchSkillSheet();

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
};

fetch();

const showConfirmDelete = (id) => {
  deleteTarget.value = id;
  confirmDelete.value = true;
};
const deleteMember = async () => {
  await memberStore.deleteMember({ id: deleteTarget.value });
  deleteTarget.value = undefined;
  fetch();
};
const pushToEdit = (id) => {
  router.push({ name: 'edit-employee-skill', params: { skillSheetId: id } });
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
/* .edit-btn,
.delete-btn {
  min-width: 0 !important;
  padding: 0 !important;
} */
</style>
