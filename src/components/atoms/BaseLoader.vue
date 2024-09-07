<template>
  <div class="flex justify-center items-center h-screen">
    <div class="loader">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.loader {
  border: 16px solid #ebeaea;
  /* Light grey */
  border-top: 16px solid #3498db;
  /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
