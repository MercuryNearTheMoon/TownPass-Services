<script setup lang="ts">
import { ref } from 'vue';
import topQnAList from '../../public/mock/qna_list.json';
import BaseCard from '@/components/atoms/BaseCard.vue';

const isOpened = ref(false);
const selectedNews = ref({
  id: '',
  is_show_front_page: false,
  category: '',
  name: '',
  name_en: '',
  content: ''
});
const openSheet = (newsItem: {
  id: string;
  is_show_front_page: boolean;
  category: string;
  name: string;
  name_en?: string | null;
  content: string;
}) => {
  selectedNews.value = {
    ...newsItem,
    name_en: newsItem.name_en ?? null
  } as typeof selectedNews.value;
  isOpened.value = !isOpened.value;
};
</script>

<template>
  <v-app>
    <div class="px-2 bg-primary-50 mb-0">
      <h5 class="text-black mb-6 ml-4 mt-4 text-[24px] font-bold">孕期建議</h5>
      <div class="w-full flex flex-col">
        <BaseCard
          v-for="(item, index) in topQnAList.data.list"
          :key="index"
          class="flex justify-between items-start text-grey-700 font-bold text-left"
          @click="openSheet(item)"
        >
          <img src="@/assets/images/icon-faq.svg" class="transition-transform mr-2" />
          <div class="flex-1 text-[20px] text-black">{{ item.name }}</div>
        </BaseCard>
      </div>
    </div>
    <v-bottom-sheet v-model="isOpened">
      <v-card
        max-height="500px"
        style="border-radius: 16px 16px 0px 0px; margin-bottom: 0; padding-top: 20px"
      >
        <v-card-text>
          <div class="news-title">
            <img src="@/assets/images/icon-faq.svg" class="transition-transform mr-4" />
            {{ selectedNews?.name }}
          </div>
          <div class="news-content">{{ selectedNews?.content }}</div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </v-app>
</template>

<style scoped>
.title {
  position: relative;
  display: inline-block;
}
.news-title {
  font-size: 20px;
  font-weight: bold;
  word-break: break-all;
  height: auto;
  margin-bottom: 24px;
  display: flex;
}
.news-content {
  font-size: 20px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 24px;
}
.v-application__wrap {
  margin: 0 !important;
}

</style>
