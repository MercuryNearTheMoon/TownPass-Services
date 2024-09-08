<template>
  
  <v-app class="h-full bg-primary-50 mb-0">
  <BaseLoader v-if="!hasDone" />
  <main class="h-full mb-0" v-else>
    
    <div class="pt-4 bg-primary-50 h-full flex flex-col">

      <div class="bg-white rounded-xl shadow-lg mx-4 ">
        
        <div class="flex items-center justify-end px-4 pt-2 m-0">
          <span class="flex w-3 h-3 bg-primary-400 rounded-full"></span>
          <div class="w-24 mb-0">
            <BaseSelect default-selected="體重" default-value="weight" select-id="health_select" :options="health_fields" v-model="selected_field"></BaseSelect>
          </div>
        </div>
        <div class="h-auto">
          <LineChart v-if="hasDone" v-model:non-dialy-data="nonDailyData" v-model:dialy-data="dailyData" :chartSelect="selected_field"></LineChart>
        </div>
      </div>

      <div class="font-bold px-4 mt-6 items-center">
        <span class="items-center">歷史資料</span>
        <button class="text-primary-500 items-center " @click="isOpened = true">
          <img src="@/assets/images/info.svg" alt="Icon" class="w-5 h-5 mx-auto text-primary-500" />
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-lg mx-4 mt-4 p-4">
        <div class="p-4">
          <div class="text-lg font-bold mb-4">日常</div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="i in dailyData" class="bg-white rounded-lg shadow-md p-4 my-2 flex justify-begin items-center gap-4">
                <!-- 日期和體重部分 -->
                <div class="col-span-2 px-5 pr-10 ">
                  <div class="text-sm font-semibold text-gray-700">{{ `${i.date.toDate().getFullYear()}/${i.date.toDate().getMonth() + 1}/${i.date.toDate().getDate()}` }}</div>
                  <div class="text-sm font-medium text-gray-600">{{ i.weight }} 公斤</div>
                </div>
                <!-- 週數和血壓部分 -->
                <div class="col-span-2 px-5">
                  <div class="text-sm font-semibold text-gray-700">第{{ dailyData[dailyData.length-1].week + Math.floor(Math.abs((i.date.toDate().getTime() - dailyData[dailyData.length-1].date.toDate().getTime()) / (7 * 24 * 60 * 60 * 1000))) }}週</div>
                  <div class="text-sm font-medium text-gray-600">{{ i.bloodPressure }} mmHg</div>
                </div>
              </div>
            </div>
            <div class="text-lg font-bold mb-4">產檢</div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="i in nonDailyData" class="bg-white rounded-lg shadow-md p-4 my-2 flex justify-begin items-center">
                <!-- 日期和體重部分 -->
                <div class="col-span-2 px-5">
                  <div class="text-sm font-medium text-gray-700">{{ `${i.date.toDate().getFullYear()}/${i.date.toDate().getMonth() + 1}/${i.date.toDate().getDate()}` }}</div>
                  <div class="text-sm font-medium text-gray-600">{{ i.weight }} 公斤</div>
                </div>
                <!-- 週數和血壓部分 -->
                <div class="col-span-2 px-5">
                  <div class="text-sm font-medium text-gray-700">第{{ dailyData[dailyData.length-1].week + Math.floor(Math.abs((i.date.toDate().getTime() - dailyData[dailyData.length-1].date.toDate().getTime()) / (7 * 24 * 60 * 60 * 1000)))-2 }}週</div>
                  <div class="text-sm font-medium text-gray-600">{{ i.bloodPressure }} mmHg</div>
                </div>
                <div class="col-span-2 px-3">
                  <div class="text-sm font-medium text-gray-600">尿糖  ：{{ i.urineSugar }} mmHg</div>
                  <div class="text-sm font-medium text-gray-600">尿蛋白：{{ i.urineProtein }} mmHg</div>
                </div>
              </div>
            </div>
          </div>
      </div>

      <RouterLink to="/pregnancy-form">
        <button class="bg-primary-600 rounded-full flex items-center fixed bottom-4 right-4 p-4 shadow-lg">
          <img src="/images/plus.svg" alt="Icon" class="w-6 h-6 mx-auto" />
        </button>
      </RouterLink>
    </div>

    <v-bottom-sheet v-model="isOpened">
      <v-card
        max-height="500px"
        style="border-radius: 16px 16px 0px 0px; margin-bottom: 0; padding-top: 20px"
      >
        <v-card-text>
          <div class="flex justify-center border-b-2 border-black mb-10">
            <div class="font-blod text-[20px]">健康數據參考值</div>
          </div>
          <img src="@/assets/images/normalRangeChart.svg" alt="Icon" class="mx-auto mb-6" @click="isOpened = false" />
          <div v-for="(line, index) in kownledge" :key="index" class="m-0">
            {{ line }}
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </main>
</v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useFormStore } from '@/stores/form';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import serviceListJson from '../../public/mock/service_list.json';
import caseProgressJson from '../../public/mock/case_progress.json';
import type { User } from '@/stores/user';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import LineChart from '@/components/charts/LineChart.vue';
import { getAllDocuments }  from '@/api/pregnancy'
import { onBeforeMount ,onMounted} from 'vue';
import type{HealthRecord} from '@/api/pregnancy'
import BaseLoader  from '@/components/atoms/BaseLoader.vue';
const store = useFormStore();

const isOpened = ref(false);

store.reset();

const userStore = useUserStore();

const kownledge = ref([
  '血壓收縮壓/舒張壓：',
'80～140mmHg／50～90mmHg',
'尿糖含葡萄糖量：',
'<180mg/dL',
'每日尿蛋白總量：',
'30mg/dL-120mg/dL',
'不會超過150mg/dL'
]);

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
const hasDone = ref<Boolean>(false)
const dailyData = ref<HealthRecord[]>([])
const nonDailyData = ref<HealthRecord[]>([])
  onMounted(async()=>{
  dailyData.value = await getAllDocuments('pregnancy-health')
  nonDailyData.value = await getAllDocuments('pregnancy-health-daily')
  console.log(dailyData.value)
  hasDone.value = true
})

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

const health_fields = [
  { label: '血壓', value: 'bloodPressure' },
  { label: '尿糖', value: 'urineSugar'},
  { label: '尿蛋白',value: 'urineProtein'}
];
const selected_field = ref("weight");

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

.base-select {
  @apply bg-white;
  @apply font-bold;
}

.base-select-wrapper {
  @apply mb-0;
}

.v-application__wrap {
  @apply m-0;
}

</style>
