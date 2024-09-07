<template>
  <main>
    <ServiceTabsView v-model="activeTab">
      <template #tab0>
        <div class="py-4 bg-primary-50 h-screen">
          <DailyForm />
        </div>
      </template>
      <template #tab1>
        <div class="p-4">
          <section class="grid grid-cols-2">
            <button class="situation-button" :class="{ 'situation-button--active': activeSituation === 'apply' }"
              @click="activeSituation = 'apply'">
              申辦中({{ applyRecord.length }})
            </button>
            <button class="situation-button" :class="{ 'situation-button--active': activeSituation === 'done' }"
              @click="activeSituation = 'done'">
              已結案({{ finishRecord.length }})
            </button>
          </section>
          <section v-if="!activeRecord.length" class="flex flex-col items-center pt-40">
            <p class="text-primary-500 font-bold">
              目前無{{ activeSituation === 'apply' ? '申辦' : '結案' }}紀錄
            </p>
          </section>
          <section v-else>
            <ul class="py-4 grid grid-cols-1 gap-y-4">
              <li v-for="item in activeRecord" :key="item.id">
                <p>{{ item.name }}</p>
                <div class="mt-1 mb-4 flex justify-between pr-6">
                  <div class="text-gray-500 text-sm">
                    <p class="mb-1">{{ item.id }}</p>
                    <p>申報日期：{{ item.date }}</p>
                  </div>
                  <div class="flex flex-col items-center">
                    <img src="@/assets/images/review-icon.svg" />
                    <span class="text-sm">{{ item.status }}</span>
                  </div>
                </div>
                <ServiceStep :stepCount="item.total_step" :activeStep="item.current_step" />
              </li>
            </ul>
          </section>
        </div>
      </template>
    </ServiceTabsView>
  </main>
</template>

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
import BaseButton from '@/components/atoms/BaseButton.vue';
import type { User } from '@/stores/user';
import DailyForm from '@/components/organisms/DailyForm.vue';

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

<style lang="postcss">
html {
  @apply h-full;
}

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
