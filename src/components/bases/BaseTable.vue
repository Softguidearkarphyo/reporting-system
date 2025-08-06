<template>
  <div>
    <!-- Data Table -->
    <v-data-table
      v-model:page="page"
      :headers="headers"
      :items="items"
      :items-per-page="pagination ? itemsPerPage : items?.length"
      fixed-header
      v-bind="$attrs"
      :show-select="checkbox"
      :no-data-text="noDataMessageText"
      class="custom-header-bg"
      hide-default-footer
      density="compact"
    >
      <template
        v-for="header in headers"
        v-slot:[`item.${header.key}`]="{ item }"
      >
        <slot :name="`item.${header.key}`" :item="item">
          {{ item[header.key] }}
        </slot>
      </template>
    </v-data-table>

    <!-- Pagination Section Outside Table Border -->
    <div v-if="pagination" class="mt-4">
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
          />
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
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
    required: true,
  },
});

const page = ref(1);
const itemsPerPage = ref(props.itemsCount);
const itemsPerPageSelectItems = ref([
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
]);

const totalItems = computed(() => props.items?.length);
const pageCount = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);
const startItem = computed(
  () => (page.value - 1) * itemsPerPage.value + (totalItems.value ? 1 : 0)
);
const endItem = computed(() => {
  const end = page.value * itemsPerPage.value;
  return end > totalItems.value ? totalItems.value : end;
});
const noDataMessageText = computed(() => {
  return props.noDataMessage || t('common.noDataText');
});
</script>

<style>
.custom-header-bg .v-data-table__th {
  background-color: #f8f9fa !important;
}
.v-data-table th .v-data-table-header__content span {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.v-data-table .v-btn.edit-btn,
.v-data-table .v-btn.delete-btn {
  border: 1px solid #dee2e6;
  padding: 6px !important;
  width: 32px;
  height: 32px;
  min-width: 32px;
  color: red;
}
.v-data-table .v-btn.edit-btn,
.v-data-table .v-btn.delete-btn {
  border: 1px solid #dee2e6;
  padding: 6px !important;
  width: 30px;
  height: 30px;
  min-width: 30px;
}
.v-data-table .delete-btn .v-icon,
.v-data-table .edit-btn .v-icon {
  color: #2d2e2e; /* blue */
}

.v-data-table {
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

/* === Hover: change background and icon color === */
.v-data-table .v-btn.edit-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.2); /* blue bg */
}
.v-data-table .v-btn.edit-btn:hover .v-icon {
  color: rgba(var(--v-theme-primary)); /* icon turns white */
}

.v-data-table .v-btn.delete-btn:hover {
  background-color: #f0bbc0; /* red bg */
}
.v-data-table .v-btn.delete-btn:hover .v-icon {
  color: rgb(252, 3, 3); /* icon turns white */
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>
