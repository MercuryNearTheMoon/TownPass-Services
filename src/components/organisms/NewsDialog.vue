<template>
    <div class="news-container">
        <p class="mb-4 text-grey-400">相關新聞</p>
        <p class="news-title">{{ props.title }}</p>
        <p class="news-content text-black">{{ props.content }}</p>
        <a :href="props.url" class="news-url">{{ props.url }}</a>
        <p class="news-date text-grey-400">{{ props.date }}</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  title: string;
  content: string;
  url: string;
  date: string;
}>();

</script>

<style scoped>
.news-container {
    display: flex;
    flex-direction: column;
    background-color: #edf8fa;
    width: 100%;
    height: 100%;
    padding: 32px;
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
}
.news-title {
    font-size: 24px;
    font-weight: bold;
    color: #212121;
    margin: 0 0 16px 0;
}
.news-content {
    font-size: 16px;
    margin: 0 0 16px 0;
}
.news-url {
    font-size: 16px;
    color: #212121;
    margin: 0 0 16px 0;
    word-break: break-all;
    color: #2eb6c7;
}
.news-date {
    font-size: 16px;
    margin: 0 0 16px 0;
}
</style>