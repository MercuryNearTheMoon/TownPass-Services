<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useFormStore } from '@/stores/form';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import serviceListJson from '../../public/mock/service_list.json';
import caseProgressJson from '../../public/mock/case_progress.json';
import type { User } from '@/stores/user';
import PregnancyHealthForm from '@/components/organisms/PregnancyHealthForm.vue';

const store = useFormStore();

store.reset();

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};

/**
 * 同頁面要處理多個雙向連結資料參考
 */
// const handleConnectionData = (event: { data: string }) => {
//   const result: { name: string; data: any } = JSON.parse(event.data);
//   const name = result.name;

//   switch (name) {
//     case 'userinfo':
//       handleUserInfo(event);
//       break;
//     case 'phone_call':
//       //....
//       break;
//     default:
//       break;
//   }
// };

useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);

const route = useRoute();

const activeTab = ref(0);

if (route.query.isSearch) {
  activeTab.value = 1;
}

/**
 * tab0 JS start
 */
const searchValue = ref('');
const serviceList = ref(serviceListJson);
const isSearch = ref(false);

const flatServiceList = computed(() =>
  serviceList.value.data
    .map((item) => item.agency)
    .reduce((prev, acc) => [...acc, ...prev], [])
    .map((item) => item.options)
    .reduce((prev, acc) => [...acc, ...prev], [])
);

const expandList = ref<string[]>([]);
const expandListSet = computed(() => new Set(expandList.value.map((name) => name)));

const onExpandClick = (name: string) => {
  if (expandListSet.value.has(name)) {
    const index = expandList.value.findIndex((el) => el === name);
    expandList.value.splice(index, 1);
  } else {
    expandList.value.push(name);
  }
};

const searchResult = ref<
  {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    agency_type: string;
  }[]
>();

const searchResultTypeSet = computed(() => new Set(searchResult.value?.map((item) => item.type)));
const searchResultAgencyTypeSet = computed(
  () => new Set(searchResult.value?.map((item) => item.agency_type))
);
const searchResultTitle = computed(() => searchResult.value?.map((item) => item.title));

const onSearchClick = () => {
  const result = flatServiceList.value.filter((option) => option.title.includes(searchValue.value));

  searchResult.value = result;
  expandList.value = Array.from(new Set(result.map((item) => item.type)));

  if (searchValue.value) {
    isSearch.value = true;
  } else {
    isSearch.value = false;
  }
};
/**
 * tab0 JS end
 */

/**
 * tab1 JS start
 */
const activeSituation = ref('apply');

const caseProgress = ref(caseProgressJson);

const applyRecord = computed(() =>
  caseProgress.value.data.filter((item) => item.current_step !== item.total_step)
);
const finishRecord = computed(() =>
  caseProgress.value.data.filter((item) => item.current_step === item.total_step)
);

const activeRecord = computed(() =>
  activeSituation.value === 'apply' ? applyRecord.value : finishRecord.value
);
/**
 * tab1 JS end
 */
</script>

<template>
  <main>
    <ServiceTabsView v-model="activeTab">
      <template #tab0>
        <div class="py-4 mb-0 bg-primary-50">
            <PregnancyHealthForm></PregnancyHealthForm>
        </div>
      </template>
      <template #tab1>
        <div class="p-4">
          form gose here
        </div>
      </template>
    </ServiceTabsView>
  </main>
</template>

<style lang="postcss">
.search-button {
  @apply bg-primary-500 p-1 rounded-lg;
  @apply h-11 w-11;
  @apply flex justify-center items-center;
  @apply -translate-x-1;
}

.option-title {
  @apply relative;
  @apply before:content-[''];
  @apply before:w-1.5 before:h-0.5;
  @apply before:bg-primary-500;
  @apply before:inline-block;
  @apply before:absolute before:-left-3.5 before:top-1/2 before:-translate-y-1/2;
}

.situation-button {
  @apply text-primary-500;
  @apply first:rounded-l last:rounded-r;
  @apply border border-primary-500;
  @apply py-0.5;

  &--active {
    @apply bg-primary-500 text-white;
  }
}
</style>
