<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import type { Option } from '@/components/atoms/BaseSelect.vue';
import { ref } from 'vue';
const selectList: Option[] = [
  { label: 'chart2', value: 'chart2' },
  { label: 'chart3', value: 'chart3' }
];
const selectInput = ref('');
</script>
<template>
  <div>
    <BaseSelect
      v-model="selectInput"
      selectId="chart_select"
      :options="selectList"
      defaultSelected="chart1"
    >
    </BaseSelect>
  </div>
  <LineChart :chartSelect="selectInput"></LineChart>
  <div class="flex justify-center">
    <BaseButton :outline="true" :link="true" routeInfo="/"> homebutton </BaseButton>
  </div>
</template>
