<template>
  <div>
    <v-data-table
      v-model:page="page"
      :headers="headers"
      :items="items"
      :items-per-page="pagination ? itemsPerPage : items?.length"
      fixed-header
      v-bind="$attrs"
      :show-select="checkbox"
      :no-data-text="noDataMessageText"
    >
      <template
        v-for="header in headers"
        v-slot:[`item.${header.key}`]="{ item }"
      >
        <slot :name="`item.${header.key}`" :item="item">
          {{ item[header.key] }}
        </slot>
      </template>

      <template v-slot:bottom>
        <div v-if="pagination" class="text-center">
          <v-row class="d-flex justify-space-between align-center">
            <v-col>
              <BaseSelect
                :model-value="itemsPerPage"
                :items="itemsPerPageSelectItems"
                variant="filled"
                density="comfortable"
                dense
                class="mb-n3 ml-n3"
                width="200px"
                label=""
                @update:model-value="itemsPerPage = parseInt($event, 10)"
              ></BaseSelect>
            </v-col>
            <v-col>
              <div class="text-subtitle-2">
                {{
                  t('common.pagination.range', {
                    start: startItem,
                    end: endItem,
                    total: totalItems,
                  })
                }}
              </div>
            </v-col>
            <v-col>
              <div class="d-flex justify-end">
                <v-pagination
                  v-model="page"
                  :length="pageCount"
                  :total-visible="6"
                  next-icon="mdi-menu-right"
                  prev-icon="mdi-menu-left"
                ></v-pagination>
              </div>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const filteredItems = ref([]);
const props = defineProps({
  headers: Array,
  items: {
    type: Array,
    default: () => [],
  },
  itemsCount: {
    type: Number,
    default: 5,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  checkbox: {
    type: Boolean,
    default: false,
  },
  noDataMessage: {
    type: String,
    required: false,
  },
});
const { t } = useI18n();
const page = ref(1);
const itemsPerPage = ref(props.itemsCount);
const itemsPerPageSelectItems = ref([
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
]);

const pageCount = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});
const startItem = computed(
  () => (page.value - 1) * itemsPerPage.value + (totalItems.value ? 1 : 0)
);
const endItem = computed(() => {
  const end = page.value * itemsPerPage.value;
  return end > totalItems.value ? totalItems.value : end;
});
const totalItems = computed(() => props.items?.length);
const noDataMessageText = computed(() => {
  return props.noDataMessage || t('common.noDataText');
});
</script>

<style>
.v-data-table th .v-data-table-header__content span {
  font-size: 0.8rem;
}
.v-data-table .v-btn.edit-btn {
  background-color: rgba(var(--v-theme-primary), 0.2);
}
/* .v-data-table .v-btn.edit-btn i {
  color: rgb(var(--v-theme-primary));
  font-size: 20px;
} */
.v-data-table .v-btn.delete-btn {
  background-color: rgb(var(--v-theme-error), 0.2);
}
/* .v-data-table .v-btn.delete-btn i {
  color: rgb(var(--v-theme-error));
  font-size: 20px;
} */
</style>
