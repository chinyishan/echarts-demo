<template>
  <div class="app-container">
    <h1>台灣地圖</h1>
    <div class="map-row">
      <el-select
        v-model="params.county"
        placeholder="Select"
        size="large"
        style="width: 240px"
      >
        <el-option
          v-for="(item, index) in county_town"
          clas="sss ssss sssss"
          :key="index"
          :label="item.label"
          :value="item.label"
          >{{ item.label }}</el-option
        >
      </el-select>
      <div class="map-taiwan" ref="taiwanMap"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";
import taiwanJSON from "@/assets/json/taiwan.json";
import { county_town } from "@/assets/json/county-town.json";

const taiwanMap = ref();
let myChart = null;
const selectedRegion = ref(null);

const params = reactive({
  county: "A",
  town: "",
});

// 地區設定
const regions = reactive([
  {
    name: "台北市",
    itemStyle: {
      areaColor: "#FF6B6B",
      opacity: 1,
    },
  },
  {
    name: "基隆市",
    itemStyle: {
      areaColor: "#4ECDC4",
      opacity: 1,
    },
  },
  {
    name: "新北市",
    itemStyle: {
      areaColor: "#45B7D1",
      opacity: 1,
    },
  },
  {
    name: "桃園縣",
    itemStyle: {
      areaColor: "#FFA07A",
      opacity: 1,
    },
  },
  {
    name: "宜蘭縣",
    itemStyle: {
      areaColor: "#98D8C8",
      opacity: 1,
    },
  },
  {
    name: "新竹縣",
    itemStyle: {
      areaColor: "#F7DC6F",
      opacity: 1,
    },
  },
  {
    name: "新竹市",
    itemStyle: {
      areaColor: "#BB8FCE",
      opacity: 1,
    },
  },
  {
    name: "苗栗縣",
    itemStyle: {
      areaColor: "#82E0AA",
      opacity: 1,
    },
  },
  {
    name: "彰化縣",
    itemStyle: {
      areaColor: "#F1948A",
      opacity: 1,
    },
  },
  {
    name: "台中市",
    itemStyle: {
      areaColor: "#85C1E9",
      opacity: 1,
    },
  },
  {
    name: "南投縣",
    itemStyle: {
      areaColor: "#F8C471",
      opacity: 1,
    },
  },
  {
    name: "雲林縣",
    itemStyle: {
      areaColor: "#73C6B6",
      opacity: 1,
    },
  },
  {
    name: "嘉義縣",
    itemStyle: {
      areaColor: "#E59866",
      opacity: 1,
    },
  },
  {
    name: "嘉義市",
    itemStyle: {
      areaColor: "#FAD7A0",
      opacity: 1,
    },
  },
  {
    name: "屏東縣",
    itemStyle: {
      areaColor: "#D7BDE2",
      opacity: 1,
    },
  },
  {
    name: "台南市",
    itemStyle: {
      areaColor: "#A3E4D7",
      opacity: 1,
    },
  },
  {
    name: "高雄市",
    itemStyle: {
      areaColor: "#F5B7B1",
      opacity: 1,
    },
  },
  {
    name: "台東縣",
    itemStyle: {
      areaColor: "#AED6F1",
      opacity: 1,
    },
  },
  {
    name: "花蓮縣",
    itemStyle: {
      areaColor: "#F9E79F",
      opacity: 1,
    },
  },
  {
    name: "澎湖縣",
    itemStyle: {
      areaColor: "#A2D9CE",
      opacity: 1,
    },
  },
  {
    name: "金門縣",
    itemStyle: {
      areaColor: "#D2B4DE",
      opacity: 1,
    },
  },
  {
    name: "連江縣",
    itemStyle: {
      areaColor: "#FADBD8",
      opacity: 1,
    },
  },
]);

// 散點座標
const scatter = reactive([
  {
    name: "大樹醫藥股份有限公司-總部",
    value: [24.990994405686934, 121.31154760370656],
  },
]);

onMounted(() => {
  window.addEventListener("resize", function () {
    myChart.resize();
  });
  drawTaiwan();
});

const drawTaiwan = async () => {
  myChart = echarts.init(taiwanMap.value);
  echarts.registerMap("taiwan", taiwanJSON); //注册可用的地图

  const option = {
    // 數據系列
    series: [
      {
        type: "map",
        map: "taiwan",
        geoIndex: 1,
        aspectScale: 1, // 调整地图的宽高比例
        roam: true, //是否允許縮放，拖曳
        zoom: 1, //初始化大小
        scaleLimit: {
          //缩放大小限制
          min: 1, //最小
          max: 3, //最大
        },
        center: [121, 24], //設置中心點
        emphasis: {
          disabled: true, // 禁用高亮效果
        },
        select: {
          disabled: true, // 禁用选中效果
        },
        label: {
          show: true,
          distance: 100,
          textStyle: {
            color: "#000",
            // borderWidth: 2,
            borderColor: "#000",
            fontSize: 12,
            fontWeight: "400",
          },
        },
        data: regions.map((region) => ({
          name: region.name,
          value: 0,
          itemStyle: {
            areaColor: "#ffffff",
            borderColor: "#aaaa",
            borderWidth: 1,
          },
        })),
      },
    ],
    // hover顯示
    tooltip: {
      trigger: "item",
      formatter: "{b}",
    },
  };
  myChart.setOption(option);
};

const selectRegion = (name) => {
  const selectedRegion = regions.find((region) => region.name === name);
  if (selectedRegion) {
    myChart.setOption({
      series: [
        {
          data: regions.map((region) => ({
            name: region.name,
            value: 0,
            itemStyle: {
              areaColor:
                region.name === name ? region.itemStyle.areaColor : "#ffffff",
              borderColor: "#aaaa",
              borderWidth: 1,
            },
          })),
        },
      ],
    });
  }
};
</script>

<style>
.map-row {
  width: 100%;
  height: 100%;
}

.map-taiwan {
  width: 1200px;
  max-width: 93%;
  height: 700px;
  background: #ffff;
  margin: 0 auto;
  background: #e4faff;
}

.map-list {
  background: #ffff;
  display: flex;
  justify-content: flex-start;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.map-list li {
  /* flex-grow: 1; */
  font-size: 12px;
  list-style: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: left;
}

.map-list li span {
  display: block;
  width: 20px;
  height: 10px;
  border-radius: 5px;
  margin-right: 5px;
}
</style>
