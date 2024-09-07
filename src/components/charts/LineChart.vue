<script lang="ts" setup>
import ApexChart from 'vue3-apexcharts';
import { ref, defineProps, computed } from 'vue';

// 定义 props
const props = defineProps<{
  chartSelect?: string;
}>();

// 硬编码的假数据
interface DataPoint {
  x: number; // 时间戳
  y: number; // 值
}

const data1: DataPoint[] = [
  { x: new Date('2023-01-01').getTime(), y: 45 },
  { x: new Date('2023-01-02').getTime(), y: 60 },
  { x: new Date('2023-01-03').getTime(), y: 35 },
  { x: new Date('2023-01-04').getTime(), y: 70 },
  { x: new Date('2023-01-05').getTime(), y: 55 },
  { x: new Date('2023-01-06').getTime(), y: 85 },
  { x: new Date('2023-01-07').getTime(), y: 90 },
  { x: new Date('2023-01-24').getTime(), y: 75 },
  { x: new Date('2023-01-26').getTime(), y: 80 },
  { x: new Date('2023-01-31').getTime(), y: 65 },
  { x: new Date('2023-02-07').getTime(), y: 95 },
  { x: new Date('2023-02-09').getTime(), y: 100 },
  { x: new Date('2023-02-14').getTime(), y: 85 },
  { x: new Date('2023-02-16').getTime(), y: 110 },
  { x: new Date('2023-02-21').getTime(), y: 120 }
];

const data2 = [
  { x: new Date('2023-01-02').getTime(), y: 30 },
  { x: new Date('2023-01-04').getTime(), y: 25 },
  { x: new Date('2023-01-08').getTime(), y: 50 },
  { x: new Date('2023-01-11').getTime(), y: 65 },
  { x: new Date('2023-01-13').getTime(), y: 45 },
  { x: new Date('2023-01-18').getTime(), y: 55 },
  { x: new Date('2023-01-20').getTime(), y: 40 },
  { x: new Date('2023-01-25').getTime(), y: 70 },
  { x: new Date('2023-01-28').getTime(), y: 55 },
  { x: new Date('2023-02-02').getTime(), y: 75 },
  { x: new Date('2023-02-10').getTime(), y: 60 },
  { x: new Date('2023-02-13').getTime(), y: 80 },
  { x: new Date('2023-02-15').getTime(), y: 45 },
  { x: new Date('2023-02-19').getTime(), y: 90 }
];

const data3 = [
  { x: new Date('2023-01-02').getTime(), y: 80 },
  { x: new Date('2023-01-04').getTime(), y: 100 },
  { x: new Date('2023-01-07').getTime(), y: 90 },
  { x: new Date('2023-01-12').getTime(), y: 110 },
  { x: new Date('2023-01-14').getTime(), y: 95 },
  { x: new Date('2023-01-19').getTime(), y: 120 },
  { x: new Date('2023-01-22').getTime(), y: 130 },
  { x: new Date('2023-01-26').getTime(), y: 115 },
  { x: new Date('2023-01-29').getTime(), y: 125 },
  { x: new Date('2023-02-01').getTime(), y: 140 },
  { x: new Date('2023-02-05').getTime(), y: 135 },
  { x: new Date('2023-02-11').getTime(), y: 145 },
  { x: new Date('2023-02-14').getTime(), y: 150 },
  { x: new Date('2023-02-18').getTime(), y: 155 }
];

// 计算属性来动态获取数据
const chartData = computed(() => {
  switch (props.chartSelect) {
    case 'chart1':
      console.log(interpolateData(data1));
      return interpolateData(data1);
    case 'chart2':
      return interpolateData(data2);
    case 'chart3':
      return interpolateData(data3);
    default:
      return interpolateData(data1); // 默认情况
  }
});

// 计算属性来定义 series
const series = computed(() => [
  {
    name: 'XYZ MOTORS',
    data: chartData.value // 使用计算属性的值
  }
]);

// 定义图表选项
const chartOptions = {
  chart: {
    height: 350,
    type: 'bar',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight' // 使用平滑曲线
  },
  title: {
    text: 'Stock Price Movement',
    align: 'left'
  },
  grid: {
    borderColor: '#e0e0e0', // 网格线颜色
    strokeDashArray: 5, // 网格线样式
    column: {
      colors: ['#121212', 'transparent'],
      opacity: 0.5
    },
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    row: {
      colors: ['#e5e5e5', 'transparent'],
      opacity: 0.5
    }
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toFixed(0); // 格式化 y 轴值
      }
    },
    title: {
      text: 'Value'
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      formatter: function (val: number) {
        const firstDataX = chartData.value[0].x; // 第一条数据的 x 值
        const currentDataX = val; // 当前 x 值
        if (firstDataX === currentDataX) return ``;
        const weeksDifference = Math.floor((currentDataX - firstDataX) / (7 * 24 * 60 * 60 * 1000)); // 计算周数
        return `第 ${weeksDifference + 2} 周`; // 返回格式化的周数
      }
    },
    tickAmount: 7 // 这里设置每8个点显示一个x轴标签，可以根据数据量进行调整,
  },
  tooltip: {
    shared: false,
    x: {
      formatter: function (val: number) {
        const date = new Date(val);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`; // 格式化为 "年/月/日"
      }
    },
    y: {
      formatter: function (val: number) {
        return val.toFixed(0); // 格式化 y 值
      }
    }
  }
};
</script>

<template>
  <div id="chart">
    <ApexChart type="line" height="350" :options="chartOptions" :series="series"></ApexChart>
  </div>
</template>
