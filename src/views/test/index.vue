<template>
  <div>
    <h2>測試</h2>
    <br />
    <div style="width: 50%; height: 400px">
      <div ref="chartRef" style="width: 100%; height: 400px"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
// 1. 引入 echarts
import * as echarts from "echarts";

// 2. ref 綁定 DOM
const chartRef = ref();
let myChart = null;

// 3. 初始化圖表
const drawChart = () => {
  myChart = echarts.init(chartRef.value);

  const option = {
    title: { text: "Vue3 + ECharts" },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}", // 自訂格式
    },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月"], // X 軸標籤
    },
    yAxis: {},
    series: [{ type: "bar", data: [10, 20, 15, 30] }],
  };

  // 設定圖表選項
  myChart.setOption(option);
};

onMounted(() => {
  // 4. 響應式調整
  window.addEventListener("resize", () => {
    myChart.resize();
  });
  drawChart();
});
</script>
<style></style>
