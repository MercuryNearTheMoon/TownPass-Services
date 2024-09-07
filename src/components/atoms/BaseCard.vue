<template>
  <div class="base-card">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="postcss">
.base-card {
  @apply bg-white;
  @apply p-8;
  @apply rounded-2xl;
  @apply shadow;
  @apply mx-4;
}
</style>
