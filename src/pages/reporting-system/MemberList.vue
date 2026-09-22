<template>
  <v-row class="align-center">
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
      <BaseButton
        @click="exportFile"
        :disabled="!items.length"
        style="width: 100px"
      >
        Export
      </BaseButton>
    </v-col>
  </v-row>
  <ParentCard>
    <BaseTable :headers="headers" :items="items" :density="true">
      <template #[`item.name`]="{ item }">
        <div class="d-flex align-center">
          <v-avatar size="37" class="mr-3">
            <v-img 
              v-if="item.staff_image_url && item.staff_image_url !== 'undefined'" 
              :src="item.staff_image_url" 
            />
            <v-img
              v-else
              class="profileImage"
              :src="profileImgPath(isJapanese ? item.jp_name : item.eng_name)"
            />
          </v-avatar>
          <div>
            <div class="font-weight-medium">
              {{ isJapanese ? item.jp_name : item.eng_name }}
            </div>
            <div class="text-caption text-grey-darken-1">
              {{ item.position?.name }}
            </div>
          </div>
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
            <v-icon icon="tabler:IconEdit" size="15" />
          </BaseButton>

          <BaseButton
            v-if="!isSelf(item.id)"
            elevation="0"
            @click.stop="showConfirmDelete(item.id)"
            color=""
            class="delete-btn"
            size="small"
            :style="{ width }"
            :add-class="['ma-1']"
          >
            <v-icon icon="tabler:IconTrash" size="15" />
          </BaseButton>
          <div v-else style="width: 33%"></div>
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
import { exportExcel } from '@/excel-export/payroll/excel';
import { profileImgPath } from '@/utils/helper';
import { ref, computed, watch, onMounted } from 'vue';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const memberStore = useMemberStore();
const router = useRouter();
const role = computed(() => authStore.staffRole || localStorage.getItem('staff-role'));
const confirmDelete = ref(false);
const deleteTarget = ref(undefined);
const search = ref('');
const items = ref([]);
const width = '10px';
const fallbackColor = { id: undefined, name: 'others', color: '#B7410E50' };
let originalItems = [];
const isJapanese = computed(() => locale.value === 'ja');

const currentStaffId = computed(() => {
  const staffData = authStore.staff || authStore.loginStaff;

  if (staffData && !Array.isArray(staffData)) {
    return staffData.id || staffData.staff_id || null;
  }

  if (Array.isArray(staffData) && staffData.length > 0) {
    const savedImg = sessionStorage.getItem('profileImg');

    if (savedImg) {
      const match = staffData.find((s) => {
        const customImg = s.staff_image_url;
        const defaultEngImg = profileImgPath(s.eng_name);
        const defaultJpImg = profileImgPath(s.jp_name);

        return (
          customImg === savedImg ||
          defaultEngImg === savedImg ||
          defaultJpImg === savedImg
        );
      });

      if (match) return match.id;
    }
  }

  return localStorage.getItem('staff-id') || null;
});

const isSelf = (itemId) => {
  if (!currentStaffId.value) return false;
  return Number(currentStaffId.value) === Number(itemId);
};

const headers = computed(() => {
  const tmpHeaders = [
    {
      title: t('memberList.table.name'),
      key: 'name',
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

  if (String(role.value) === String(ADMIN)) {
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

const fetch = async () => {
  await memberStore.fetchMember({ leave: {}, over_time: {} });
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

onMounted(async () => {
  if (!authStore.staff) {
    await authStore.fetchStaff();
  }
  await fetch();
});

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

const exportFile = () => {
  exportExcel(items.value);
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