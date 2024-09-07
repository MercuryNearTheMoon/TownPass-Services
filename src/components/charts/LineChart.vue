<script lang="ts" setup>
import ApexChart from 'vue3-apexcharts';
import { ref, defineProps, computed } from 'vue';

// 定义 props
const props = defineProps<{
  chartSelect?: string;
}>();

// 定义数据集
const data1 = [10, 41, 35, 51, 49, 62, 69, 91, 148];
const data2 = [34, 10, 5, 51, 30, 72, 129, 51, 148];
const data3 = [123, 120, 50, 24, 60, 10, 46, 170, 10];

// 计算属性来动态获取数据
const chartData = computed(() => {
  switch (props.chartSelect) {
    case 'chart1':
      console.log(1);
      return data1;
    case 'chart2':
      console.log(2);
      return data2;
    case 'chart3':
      console.log(3);
      return data3;
    default:
      return data1; // 默认情况
  }
});

// 定义 x 轴分类
const xaxis = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']);

// 计算属性来定义 series
const series = computed(() => [
  {
    name: 'Desktops',
    data: chartData.value // 使用计算属性的值
  }
]);

// 定义图表选项
const chartOptions = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Product Trends by Month',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // 每行的颜色
      opacity: 0.5
    }
  },
  xaxis: {
    categories: xaxis.value // x 轴的分类
  }
};
</script>

<template>
  <div id="chart">
    <ApexChart type="line" height="350" :options="chartOptions" :series="series"></ApexChart>
  </div>
</template>
