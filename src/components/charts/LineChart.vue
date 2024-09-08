<script lang="ts" setup>
import ApexChart from 'vue3-apexcharts';
import { watch, ref, defineProps, computed } from 'vue';
import type { HealthRecord } from '@/api/pregnancy';
import { onMounted } from 'vue';
// 定义 props
const props = defineProps<{
  chartSelect?: string;
  nonDialyData: HealthRecord[];
  dialyData: HealthRecord[];
}>();
// 硬编码的假数据
interface DataPoint {
  x: number; // 时间戳
  y: number; // 值
}

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
  const startDate = new Date(data[0]?.x);
  const endDate = new Date(data[data.length - 1]?.x);

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
const chartData = ref<DataPoint[]>([]);
const getWeightData = async () => {
  const data1 = props.nonDialyData;
  const data2 = props.dialyData;
  let temp_data: DataPoint[] = [];
  for (const i of data1) {
    temp_data.push({ x: i['date'].toDate().getTime(), y: i['weight'] });
  }
  for (const i of data2) {
    temp_data.push({ x: i['date'].toDate().getTime(), y: i['weight'] });
  }
  chartData.value = interpolateData(temp_data);
};
const bloodPressureChartData = ref<DataPoint[][]>([[],[]])
const getBloodPressureData = async () => {
  const data1 = props.nonDialyData;
  const data2 = props.dialyData;
  let temp_data: DataPoint[][] = [[],[]];
  for (const i of data1) {
    temp_data[0].push({ x: i['date'].toDate().getTime(), y: Number(i['bloodPressure'].split('/')[0]) });
    temp_data[1].push({ x: i['date'].toDate().getTime(), y: Number(i['bloodPressure'].split('/')[1]) });
  }
  for (const i of data2) {
    temp_data[0].push({ x: i['date'].toDate().getTime(), y: Number(i['bloodPressure'].split('/')[0]) });
    temp_data[1].push({ x: i['date'].toDate().getTime(), y: Number(i['bloodPressure'].split('/')[1]) });
  }
  
  bloodPressureChartData.value[0] = interpolateData(temp_data[0]);
  bloodPressureChartData.value[1] = interpolateData(temp_data[1]);

};
const getUrineProteinData = async () => {
  const data2 = props.nonDialyData;
  let temp_data: DataPoint[] = [];
  for (const i of data2) {
    temp_data.push({
      x: i['date'].toDate().getTime(),
      y: i['urineProtein'] ? i['urineProtein'] : 0
    });
  }
  chartData.value = interpolateData(temp_data);
};
const getUrineSugarData = async () => {
  const data2 = props.nonDialyData;
  let temp_data: DataPoint[] = [];
  for (const i of data2) {
    temp_data.push({ x: i['date'].toDate().getTime(), y: i['urineSugar'] ? i['urineSugar'] : 0 });
  }
  chartData.value = interpolateData(temp_data);
};
onMounted(() => {
  getUrineSugarData();
  getUrineProteinData();
  getWeightData();
});
watch(
  () => props.chartSelect,
  () => {
    switch (props.chartSelect) {
      case 'bloodPressure':
        getBloodPressureData();
        break;
      case 'urineSugar':
        getUrineSugarData();
        break;
      case 'urineProtein':
        getUrineProteinData();
        break;
      case 'weight':
      default:
        getWeightData();
    }

  }
);
const intervalNum = computed(() => {
  console.log(chartData);
  const totalDays =
    (chartData.value[chartData.value.length - 1]?.x - chartData.value[0]?.x) /
    (24 * 60 * 60 * 1000);
  return totalDays / 7 - 1;
});
// 计算属性来定义 series
const series = computed(() => {
  if (props.chartSelect == 'bloodPressure') {
    return [
      {
        name: '收縮壓',
        data: bloodPressureChartData.value[0]
      },
      {
        name: '舒張壓',
        data: bloodPressureChartData.value[1]
      }
    ];
  }
  return [{
    name: props.chartSelect,
    data: chartData.value // 使用计算属性的值
  }];
});

// 定义图表选项
const chartOptions = computed(() => {
  const config =ref ({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    colors: ['#71C5D5'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight' // 使用平滑曲线
    },
    title: {
      text: '統計圖表',
      align: 'left'
    },
    grid: {
      borderColor: '#e0e0e0', // 网格线颜色
      strokeDashArray: 7, // 网格线样式
      column: {
        colors: ['#E3E7E9', 'transparent'],
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
          const firstDataX = chartData.value[0]?.x; // 第一条数据的 x 值
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
  })
  if(props.chartSelect == 'bloodPressure'){
    config.value.colors = ['#71C5D5','#468D9B']
  }else{
    config.value.colors = ['#71C5D5']
  }
  return config.value;
});
</script>

<template>
  <div id="chart" class="m-4 mt-2" style="min-height: auto">
    <ApexChart type="line" height="350" :options="chartOptions" :series="series"></ApexChart>
  </div>
</template>
