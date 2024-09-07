<template>
  <div class="header-container">
    <button class="back-button" @click="onBackClick">
      <img src="@/assets/icons/back.svg" alt="back" />
    </button>
    <span class="header-title">"服務名稱"</span>
  </div>
  <!-- WebView 元素 -->
  <iframe ref="webview" src="https://example.com" class="webview" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const webview = ref<HTMLIFrameElement | null>(null);

const onBackClick = () => {
  if (webview.value && webview.value.contentWindow) {
    webview.value.contentWindow.history.back();
  }
};
</script>

<style lang="postcss">
.header-container {
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
}

.webview {
  width: 100%;
  height: 100%;
}
</style>
