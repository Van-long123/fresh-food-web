<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import PrimeDataTable from "primevue/datatable";
import Column from "primevue/column";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";

export type DataTableColumn = {
  key: string;
  label: string;
  class?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
};

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[];
    data: Record<string, unknown>[];
    loading?: boolean;
    total?: number;
    page?: number;
    perPage?: number;
    searchable?: boolean;
    selectable?: boolean;
    sortable?: boolean;
    sort?: { key: string; direction: "asc" | "desc" } | null;
    selection?: Array<string | number>;
    hidePagination?: boolean;
  }>(),
  {
    loading: false,
    total: 0,
    page: 1,
    perPage: 15,
    searchable: false,
    selectable: false,
    sortable: false,
    sort: null,
    selection: () => [],
    hidePagination: false,
  },
);

const emit = defineEmits<{
  "update:page": [number];
  "update:perPage": [number];
  "update:search": [string];
  "update:sort": [{ key: string; direction: "asc" | "desc" } | null];
  "selection-change": [Array<string | number>];
}>();

const searchQuery = ref("");
const selectedIds = ref<Array<string | number>>([]);
const sortState = ref<{ key: string; direction: "asc" | "desc" } | null>(
  props.sort
);

watch(
  () => props.selection,
  (newVal) => {
    if (newVal) {
      selectedIds.value = newVal;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.sort,
  (newVal) => {
    sortState.value = newVal;
  },
  { deep: true }
);

const totalPages = computed(() => {
  const perPageValue = Math.max(1, props.perPage);
  return Math.max(1, Math.ceil((props.total || 0) / perPageValue));
});

const pageNumbers = computed(() => {
  const totalValue = totalPages.value;
  const current = Math.min(Math.max(1, props.page), totalValue);
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(totalValue, start + windowSize - 1);
  if (end - start < windowSize - 1) {
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const tableFrom = computed(() => {
  if (!props.total) return 0;
  return (props.page - 1) * props.perPage + 1;
});

const tableTo = computed(() => {
  if (!props.total) return 0;
  return Math.min(props.page * props.perPage, props.total);
});

const allSelected = computed(() => {
  if (!props.data.length) return false;
  return props.data.every((row, index) =>
    selectedIds.value.includes(getRowId(row, index)),
  );
});

const toggleSelectAll = (checked: boolean) => {
  if (!checked) {
    selectedIds.value = [];
    emit("selection-change", []);
    return;
  }

  const ids = props.data.map((row, index) => getRowId(row, index));
  selectedIds.value = ids;
  emit("selection-change", ids);
};

const toggleRowSelection = (
  row: Record<string, unknown>,
  index: number,
  checked: boolean,
) => {
  const id = getRowId(row, index);
  if (checked) {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id];
    }
  } else {
    selectedIds.value = selectedIds.value.filter((item) => item !== id);
  }
  emit("selection-change", selectedIds.value);
};

const changePage = (nextPage: number) => {
  const clamped = Math.min(Math.max(1, nextPage), totalPages.value);
  emit("update:page", clamped);
};

const changePerPage = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value);
  emit("update:perPage", value);
};

const onSort = (event: any) => {
  if (!props.sortable) return;
  const newDirection = event.sortOrder === 1 ? "asc" : "desc";
  sortState.value = { key: event.sortField, direction: newDirection };
  emit("update:sort", sortState.value);
};

const getRowId = (row: Record<string, unknown>, index: number) => {
  const directId = row.id ?? row._id;
  if (directId !== undefined && directId !== null)
    return directId as string | number;
  return index;
};

let searchTimeout: number | null = null;
watch(searchQuery, (value) => {
  if (!props.searchable) return;
  if (searchTimeout) window.clearTimeout(searchTimeout);
  searchTimeout = window.setTimeout(() => {
    emit("update:search", value.trim());
  }, 300);
});

onBeforeUnmount(() => {
  if (searchTimeout) window.clearTimeout(searchTimeout);
});

defineSlots<{
  title?: (props: {}) => any;
  subtitle?: (props: {}) => any;
  toolbar?: (props: {}) => any;
  empty?: (props: {}) => any;
  [key: `cell-${string}`]: (props: { row: any; value: any }) => any;
}>();
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
  >
    <div
      class="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">
          <slot name="title">Bảng dữ liệu</slot>
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-300">
          <slot name="subtitle">Quản lý dữ liệu và xem chi tiết.</slot>
        </p>
      </div>
      <div
        class="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center"
      >
        <slot name="toolbar"></slot>
        <span v-if="searchable" class="p-input-icon-left w-full sm:w-72">
          <i class="pi pi-search text-slate-400"></i>
          <InputText
            v-model="searchQuery"
            class="w-full"
            placeholder="Tìm kiếm"
          />
        </span>
      </div>
    </div>

    <PrimeDataTable
      :value="data"
      :striped-rows="true"
      :row-hover="true"
      responsive-layout="scroll"
      class="admin-table"
      lazy
      :sortField="sortState?.key"
      :sortOrder="sortState?.direction === 'asc' ? 1 : -1"
      @sort="onSort"
    >
      <Column v-if="selectable" header-style="width: 3rem">
        <template #header>
          <Checkbox
            :binary="true"
            :model-value="allSelected"
            @update:model-value="toggleSelectAll"
          />
        </template>
        <template #body="slotProps">
          <Checkbox
            :binary="true"
            :model-value="
              selectedIds.includes(getRowId(slotProps.data, slotProps.index))
            "
            @update:model-value="
              toggleRowSelection(slotProps.data, slotProps.index, $event)
            "
          />
        </template>
      </Column>

      <Column
        v-for="column in columns"
        :key="column.key"
        :field="column.key"
        :class="column.class"
        :sortable="sortable && column.sortable"
      >
        <template #header>
          <span
            class="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {{ column.label }}
          </span>
        </template>
        <template #body="slotProps">
          <slot
            :name="`cell-${column.key}`"
            :row="slotProps.data"
            :value="slotProps.data[column.key]"
          >
            <span class="text-sm text-slate-700 dark:text-slate-200">
              {{ slotProps.data[column.key] }}
            </span>
          </slot>
        </template>
      </Column>

      <template #empty>
        <div class="flex flex-col items-center gap-3 py-10 text-slate-500">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
          >
            <i class="pi pi-inbox text-lg"></i>
          </div>
          <div class="text-sm">
            <slot name="empty">Không có dữ liệu.</slot>
          </div>
        </div>
      </template>
      <!-- <template #loading>
        <div class="space-y-3 px-6 py-6">
          <div v-for="row in 5" :key="row" class="flex items-center gap-3">
            <Skeleton width="1.5rem" height="1.5rem" border-radius="6px" />
            <Skeleton class="flex-1" height="0.75rem" border-radius="6px" />
          </div>
        </div>
      </template> -->
    </PrimeDataTable>
    <!-- <template #header>: Tương đương với việc bạn đang tự định nghĩa giao diện cho ô tiêu đề <th> ở hàng trên cùng của cột đó.
<template #body="slotProps">: Tương đương với việc định nghĩa giao diện cho tất cả các ô dữ liệu <td> thuộc cột đó ở các hàng bên dưới thân bảng (tbody).
CODE MẪU TƯỢNG TRƯNG BÊN TRONG THƯ VIỆN PRIMEVUE (<PrimeDataTable>)
<table>
  <tbody>
    Vòng lặp duyệt qua mảng dữ liệu `:value="data"` nằm ở đây! 
    <tr v-for="(item, rowIndex) in value" :key="rowIndex">
      
       Với mỗi dòng, nó sẽ duyệt qua các thẻ <Column> mà chúng ta khai báo 
      <td v-for="col in childrenColumns">
        
         Truyền phần tử hiện tại (item) và chỉ mục (rowIndex) vào slot tên là 'body' 
        <slot name="body" :data="item" :index="rowIndex">
           Giao diện mặc định nếu ta không viết template #body 
          {{ item[col.field] }}
        </slot>
        
      </td>

    </tr>
  </tbody>
</table> -->
    <div
      v-if="!hidePagination"
      class="flex flex-col gap-3 border-t border-slate-200/70 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Hiển thị
        <span class="font-medium text-slate-900 dark:text-white">{{
          tableFrom
        }}</span>
        đến
        <span class="font-medium text-slate-900 dark:text-white">{{
          tableTo
        }}</span>
        trong tổng số
        <span class="font-medium text-slate-900 dark:text-white">{{
          total
        }}</span>
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <div
          class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300"
        >
          <span>Mỗi trang</span>
          <Dropdown
            style="min-width: 5.5rem"
            :model-value="perPage"
            :options="[10, 15, 25, 50]"
            @update:model-value="
              (value: number) => emit('update:perPage', value)
            "
          />
        </div>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
            :disabled="page <= 1"
            @click="changePage(page - 1)"
          >
            Trước
          </button>
          <button
            v-for="pageNumber in pageNumbers"
            :key="pageNumber"
            type="button"
            class="rounded-full border px-3 py-1 text-sm font-medium"
            :class="
              pageNumber === page
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            "
            @click="changePage(pageNumber)"
          >
            {{ pageNumber }}
          </button>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
            :disabled="page >= totalPages"
            @click="changePage(page + 1)"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
