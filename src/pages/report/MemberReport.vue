<template>
  <BaseTitle>Member Report</BaseTitle>
  <ParentCard>
    <Form>
      <v-row class="mt-3">
        <v-col cols="12" sm="6" lg="3" class="pa-1">
          <BaseDatePicker
            :label="t('addMember.form.permanent_date')"
            :width="'100%'"
            prependIcon="mdi-calendar-month"
          ></BaseDatePicker>
        </v-col>
        <v-col cols="12" sm="6" lg="3" class="pa-1">
          <BaseSelect
            :label="t('staffCard.name')"
            class="mx-auto"
            item-value="id"
            item-title="name"
            prependIcon="mdi-account"
            :items="items"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="3" class="gap-2">
          <BaseButton type="submit" :width="'150px'" class="mx-6">{{
            t('common.search')
          }}</BaseButton>
          <BaseButton :width="'150px'">EXCEL</BaseButton>
        </v-col>
      </v-row>
    </Form>
  </ParentCard>
  <ParentCard>
    <h2>hdh</h2>
  </ParentCard>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useMemberStore } from '@/stores/member/member.js';

const { t } = useI18n();
const memberStore = useMemberStore();
const items = ref([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    await memberStore.fetchMember();
    const tmpMembers = memberStore.getMembers?.map((member) => ({
      id: member.id,
      name: member.eng_name,
    }));
    tmpMembers?.sort((a, b) => {
      if (!a.sort_key) return 1;
      if (!b.sort_key) return -1;
      return a.sort_key - b.sort_key;
    });
    items.value = [...tmpMembers];
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};
</script>
<style></style>
