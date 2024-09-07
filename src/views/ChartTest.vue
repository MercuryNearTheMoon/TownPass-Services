<script setup lang="ts">
    import LineChart from '@/components/charts/LineChart.vue';
    import BaseButton from '@/components/atoms/BaseButton.vue';
</script>
<template>
    <LineChart></LineChart>
    <div class="flex justify-center">
      <BaseButton :outline="true" :link="true" routeInfo="/">
        homebutton
      </BaseButton>
    </div>
</template>