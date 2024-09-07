<script lang="ts" setup>
import ApexChart from 'vue3-apexcharts';
import {ref, onMounted,defineProps, computed } from 'vue';
import { getAllDocuments }  from '@/api/pregnancy'

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

// 线性插值函数
function linearInterpolate(x: number, x1: number, y1: number, x2: number, y2: number): number {
  return y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);
}

// 插值算法
function interpolateData(data: DataPoint[]): DataPoint[] {
  const result: DataPoint[] = [];

  // 按时间排序数据
  data.sort((a, b) => a.x - b.x);

  // 获取时间范围
  const startDate = new Date(data[0].x);
  const endDate = new Date(data[data.length - 1].x);

  // 遍历每一天并插值
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const currentTime = date.getTime();
    const existingPoint = data.find((point) => point.x === currentTime);

    if (existingPoint) {
      // 如果有该日期的数据点，直接加入结果
      result.push(existingPoint);
    } else {
      // 查找前后两个已知点
      const prevPoint = data.filter((point) => point.x < currentTime).pop();
      const nextPoint = data.find((point) => point.x > currentTime);

      if (prevPoint && nextPoint) {
        // 使用线性插值计算
        const interpolatedY = linearInterpolate(
          currentTime,
          prevPoint.x,
          prevPoint.y,
          nextPoint.x,
          nextPoint.y
        );
        result.push({ x: currentTime, y: interpolatedY });
      }
    }
  }

  return result;
}
const weightData = ref<DataPoint[]>([]);
const bloodPressureData =ref<DataPoint[]>([]);
const urineProteinData =ref<DataPoint[]>([]);
const urineSugarData =ref<DataPoint[]>([]);
const getWeightData = async()=>{
  const data1 = await getAllDocuments('pregnancy-health')
  const data2 = await getAllDocuments('pregnancy-health-daily')
  console.log(data1,data2)
  let temp_data:DataPoint[] = [];
  for(const i of data1){
    temp_data.push({x:i['date'].toDate().getTime(),y:i['weight']})
  }
  for(const i of data2){
    temp_data.push({x:i['date'].toDate().getTime(),y:i['weight']})
  }
  weightData.value = interpolateData(temp_data)
}
const getBloodPressureData = async()=>{
  const data1 = await getAllDocuments('pregnancy-health')
  const data2 = await getAllDocuments('pregnancy-health-daily')
  console.log(data1,data2)
  let temp_data:DataPoint[] = [];
  for(const i of data1){
    temp_data.push({x:i['date'].toDate().getTime(),y:i['bloodPressure']})
  }
  for(const i of data2){
    temp_data.push({x:i['date'].toDate().getTime(),y:i['bloodPressure']})
  }
  weightData.value = interpolateData(temp_data)
}
const getUrineProteinData = async()=>{
  const data2 = await getAllDocuments('pregnancy-health-daily')
  let temp_data:DataPoint[] = [];
  for(const i of data2){
    temp_data.push({x:i['date'].toDate().getTime(),y:i['urineProtein']?i['urineProtein']:0})
  }
  urineProteinData.value = interpolateData(temp_data)
}
const getUrineSugarData = async()=>{
  const data2 = await getAllDocuments('pregnancy-health-daily')
  let temp_data:DataPoint[] = [];
  for(const i of data2){
    temp_data.push({x:i['date'].toDate().getTime(),y:i['urineSugar']?i['urineSugar']:0})
  }
urineSugarData.value = interpolateData(temp_data)
}
// 计算属性来动态获取数据
onMounted(()=>{
  getBloodPressureData();
  getUrineSugarData();
  getUrineProteinData()
  getWeightData();
})
const chartData = computed(() => {
  switch (props.chartSelect) {
    case 'bloodPressure':
      return bloodPressureData.value
    case 'urineSugar':
      return urineSugarData.value
    case 'urineProtein':
      return urineProteinData.value
    case 'weight':
    default:
      return weightData.value
  }

});
const intervalNum = computed(() => {
  console.log(chartData)
  const totalDays =
    (chartData.value[chartData.value.length - 1]?.x - chartData.value[0]?.x) / (24 * 60 * 60 * 1000);
  return totalDays / 7 - 1;
});
// 计算属性来定义 series
const series = computed(() => [
  {
    name: 'XYZ MOTORS',
    data: chartData.value // 使用计算属性的值
  }
]);

// 定义图表选项
const chartOptions = computed(() => {
  return {
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
      curve: 'straight' // 使用平滑曲线
    },
    title: {
      text: 'Stock Price Movement',
      align: 'left'
    },
    grid: {
      borderColor: '#e0e0e0', // 网格线颜色
      strokeDashArray: 7, // 网格线样式
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
        formatter: function (val: string, timestamp: number) {
          const firstDataX = chartData.value[0].x; // 第一条数据的 x 值
          const currentDataX = new Date(val).getTime(); // 当前 x 值
          /* console.log("val",new Date(val)) */
          // console.log("timestamp",new Date(timestamp))
          if (firstDataX === currentDataX) return `第1週`;
          return `第 ${(currentDataX - firstDataX) / (7 * 24 * 60 * 60 * 1000) + 1} 週`; // 返回格式化的周数
        }
      },
      tickAmount: intervalNum.value
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
});
</script>

<template>
  <div id="chart" class="m-4 mt-2" style="min-height: auto">
    <ApexChart type="line" height="150" :options="chartOptions" :series="series"></ApexChart>
  </div>
</template>
