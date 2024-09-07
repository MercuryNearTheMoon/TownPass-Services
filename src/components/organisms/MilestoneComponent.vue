<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAllDocuments } from '@/api/pregnancy';
import Loading from '@/components/atoms/BaseLoader.vue';
import milestoneData from '@/utils/milestoneData.json';

const isLoading = ref(true);

const data = milestoneData.data;

const now = ref(0);

onMounted(async () => {
  try {
    const fetchedData = await getAllDocuments('pregnancy-health');
    const today = new Date();
    const fetchedDate = new Date(fetchedData[0].date);
    const dayDifference = today.getDay() - fetchedDate.getDay();

    console.log('Day difference:', dayDifference);
    console.log('Today:', today);
    console.log('Fetched date:', fetchedDate);

    now.value = fetchedData[0].week + dayDifference;
  } catch (error) {
    console.error('Error fetching documents:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <Loading v-if="isLoading" />
    <div class="milestone-container" v-else>
      <div
        v-for="(step, index) in data"
        :key="index"
        class="step"
        :class="{ 'step--active': now >= step.index }"
      >
        <span class="graph-container">
          <span class="dot" />
          <span class="line" />
        </span>
        <div class="step-content">
          <div class="step-title" :class="{ 'text--active': now >= step.index }">
            第{{ step.week }}週
          </div>
          <div v-for="(txt, index) in step.content" :key="index">
            <div class="dash" />
            <div class="step-content-text" :class="{ 'text--active': now >= step.index }">
              <div class="step-title">{{ txt.title }}</div>
              <div class="step-detail" :class="{ 'text--active': now >= step.index }">
                {{ txt.detail }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.milestone-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #edf8fa;
  width: 100%;
  padding: 32px 0px;
}
.step {
  display: flex;
  width: 100%;
  height: auto;
  padding: 0px;
  background-color: #fcfcfc;
  border: 28px solid #fcfcfc;
  border-radius: 0px;
}
.step--active {
  background-color: #edf8fa;
  border: 28px solid #edf8fa;
  color: #b6b9bf;
}
.text--active {
  color: #d8dbe0 !important;
}
.step-content {
  width: 100%;
  color: #212121;
  align-items: start;
}
.step-title {
  font-size: 16px;
  font-weight: bold;
}
.step-detail {
  font-size: 14px;
  color: rgb(109, 109, 109);
}
.step-content-text {
  font-size: 14px;
  margin: 10px 0px;
}
.graph-container {
  display: flex;
  margin-right: 30px;
  height: 100%;
}
.dot {
  width: 10px;
  height: 10px;
  background-color: #5ab4c5;
  border-radius: 50%;
  position: absolute;
  top: 10px;
}
.line {
  width: 2px;
  margin-top: 15px;
  height: calc(100% - 20px);
  background-color: #5ab4c5;
  position: absolute;
  top: 10px;
  left: 4px;
  align-items: end;
}
.dash {
  position: relative;
  width: 10px;
  height: 2px;
  background-color: #5ab4c5;
  vertical-align: middle;
  top: 22px;
  left: -25px;
}
</style>
