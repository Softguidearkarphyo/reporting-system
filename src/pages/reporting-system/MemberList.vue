<template>
  <v-row class="align-center mb-3">
      <v-col cols="6" md="7" lg="9" class="d-flex justify-start">
        <BaseTitle> {{ t('memberList.title') }} </BaseTitle>
      </v-col>
      <v-col cols="6" md="5" lg="3" class="d-flex justify-end">
        <BaseTextField
          v-model="search"
          :label="t('common.search')"
          color="primary"
          prepend-icon="mdi-magnify"
          class="mb-n5"
          type="text"
          variant="plain"
          dense
        >
        </BaseTextField>
      </v-col>
    </v-row> 
  <ParentCard>
    <BaseTable
      :headers="headers"
      :items="items"
      :height="windowHeight"
      :items-count="itemsCount"
    >
      <template #[`item.position`]="{ item }">
        <div
          class="rounded-pill py-1 text-center mx-auto"
          :style="{
            backgroundColor: item.position?.color,
            width: '120px',
            fontSize: '10px',
            color: 'white',
          }"
        >
          <span>{{ item.position?.name }}</span>
        </div>
      </template>

      <template #[`item.action`]="{ item }">
        <span class="d-flex justify-center p-0">
          <BaseButton
            elevation="0"
            @click.stop="pushToEdit(item.id)"
            color=""
            class="edit-btn"
            size="small"
            :style="{ width }"
            :add-class="['ma-1']"
          >
            <v-icon icon="tabler:IconEdit" size="18" color="primary" />
          </BaseButton>
          <BaseButton
            v-if="authStore.loginStaff?.id !== item.id"
            elevation="0"
            @click.stop="showConfirmDelete(item.id)"
            color=""
            class="delete-btn"
            size="small"
            :style="{ width }"
            :add-class="['ma-1']"
          >
            <v-icon icon="tabler:IconTrash" size="18" style="color: #ff0000" />
          </BaseButton>
          <div v-else style="width: 50%"></div>
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
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useMemberStore } from '@/stores/member/member.js';
import { position } from '@/utils/data';
import { ADMIN } from '@/utils/constant';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const memberStore = useMemberStore();
const router = useRouter();
const role = authStore.staffRole;
const confirmDelete = ref(false);
const deleteTarget = ref(undefined);
const search = ref('');
const items = ref([]);
const width = '10px';
const fallbackColor = { id: undefined, name: 'others', color: '#B7410E50' };
let originalItems = [];
const headers = computed(() => {
  const isJapanese = locale.value === 'ja';
  const tmpHeaders = [
    {
      title: t('memberList.table.name').toUpperCase(),
      key: isJapanese ? 'jp_name' : 'eng_name',
    },
    {
      title: t('memberList.table.position'),
      key: 'position',
      align: 'center',
      sortable: false,
    },
    {
      title: t('memberList.table.phone'),
      key: 'ph_number',
      sortable: false,
    },
    {
      title: t('memberList.table.email'),
      key: 'email',
      sortable: false,
    },
    {
      title: t('memberList.table.address'),
      key: 'address',
      sortable: false,
    },
  ];
  if (role === ADMIN) {
    tmpHeaders.push({
      title: t('memberList.table.action'),
      key: 'action',
      align: 'center',
      sortable: false,
      width: '10%',
    });
  }
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
  await memberStore.fetchMember();
  const tmpMembers = memberStore.getMembers?.map((member) => ({
    ...member,
    position:
      position.value?.find((pos) => pos.id === member.position) ||
      fallbackColor,
  }));
  tmpMembers?.sort((a, b) => {
    if (!a.sort_key) return 1;
    if (!b.sort_key) return -1;
    return a.sort_key - b.sort_key;
  });
  items.value = [...tmpMembers];
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
  router.push({ name: 'edit-members', params: { memberId: id } });
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
