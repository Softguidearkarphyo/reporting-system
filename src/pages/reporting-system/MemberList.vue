<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-3 mt-n2">
      <BaseTitle>{{ t('memberList.title') }}</BaseTitle>
      <div style="width: 300px">
        <v-text-field
          v-model="search"
          :label="t('common.search')"
          variant="underlined"
          color="primary"
        >
          <template #prepend>
            <v-icon color="primary" class="mr-n2">mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>
    <ParentCard class="side">
      <BaseTable :headers="headers" :items="items" :height="windowHeight" :items-count="itemsCount" class="mt-n4">
        <template #item.position="{ item }">
          <div class="rounded-pill py-1 px-1 text-center mx-auto" :style="{backgroundColor: item.position_color, width: '75px', fontSize: '11px'}">{{item.position}}</div>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex justify-end">
            <BaseButton
              elevation="0"
              @click.stop="
                drawer = true;
                title = 'edit';
                id = item.id;
              "
              color=""
              class="edit-btn"
              size="small"
            >
              <v-icon> mdi-pencil </v-icon>
            </BaseButton>
            <BaseButton
              elevation="0"
              @click.stop="showConfirmDelete(item.id)"
              color=""
              class="delete-btn"
              size="small"
            >
              <v-icon>
                mdi-trash-can</v-icon
              >
            </BaseButton>
          </div>
        </template>
      </BaseTable>
    </ParentCard>
    <BaseConfirmDelete
      v-model="confirmDelete"
      :title="t('common.deleteConfirmTitle')"
      :text="t('memberList.deleteConfirmText')"
      :class="{ 'd-none': !confirmDelete }"
      @yes="
        confirmDelete = false;
        deleteMember();
      "
      @no="confirmDelete = false; deleteTarget = undefined"
    ></BaseConfirmDelete>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
//dummy data
import staffs from './data/staffs.js';

const { t, locale } = useI18n();
const confirmDelete = ref(false)
const deleteTarget = ref(undefined)
const search = ref('')
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  return [
    {
      title: t('memberList.table.name'),
      key: isJapanese ? "jp_name" : "eng_name",
    },
    {
      title: t('memberList.table.position'),
      key: "position",
      align: "center",
      sortable: false,
    }, 
    {
      title: t('memberList.table.phone'),
      key: "ph_number",
      sortable: false,
    },
    {
      title: t('memberList.table.email'),
      key: "email",
      sortable: false,
    },
    {
      title: t('memberList.table.address'),
      key: "address",
      sortable: false,
    },
    {
      title: t('memberList.table.action'),
      key: "action",
      align: "center",
      sortable: false,
      width: "10%",
    },
  ]
});
let windowHeight, itemsCount;
if (window.innerWidth > 1366) {
  windowHeight = window.innerHeight / 1.4;
  itemsCount = 10;
} else {
  windowHeight = window.innerHeight / 1.8;
  itemsCount = 5;
}
const positionColor = {
  ceo : '#2979FF33',
  manager: '#00E67633',
  senior: '#FFA72633',
  junior: '#FF525233',
  designer: '#7C4DFF33'
}

const tmpStaffs = staffs?.map(item => ({...item, position_color: positionColor[item.position?.toLocaleLowerCase()] || '#B7410E50'}))
const items = ref([...tmpStaffs])
items.value?.sort((a, b) => {
  if (!a.sort_key) return 1;
  if (!b.sort_key) return -1;
  return a.sort_key - b.sort_key;
});
const originalItems = [...items.value]

const showConfirmDelete = (id) => {
  if (id) {
    deleteTarget.value = id;
  }
  confirmDelete.value = true;
};

const deleteMember = () => {
  console.log('this id: '+ deleteTarget.value + ' will be deleted');
}

watch(
  () => search.value, 
  (newVal) => {
    if (newVal) {
      items.value = originalItems.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(newVal.toLowerCase())
      ))
    } else {
      items.value = [...originalItems]
    }
  }
)
</script>
