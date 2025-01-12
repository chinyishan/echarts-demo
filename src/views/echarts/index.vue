<template>
  <div class="app-container">
    <div class="map-wrap">
      <div class="map-data">
        <h1>全國人口參加健保人數</h1>
        <ul>
          <li
            v-for="(item, index) in countyTown"
            :key="index"
            @click="handleActive(item.label)"
          >
            {{ item.label }}
          </li>
        </ul>
        <!-- <el-select
          v-model="params.county"
          placeholder="Select"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="(item, index) in countyTown"
            :key="index"
            :label="item.label"
            :value="item.key"
            >{{ item.label }}</el-option
          >
        </el-select> -->
      </div>
      <div class="map-taiwan" ref="taiwanMap"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";
import taiwanJSON from "@/assets/json/taiwan.json";
import { countyTown } from "@/assets/json/county-town.json";
import { health } from "@/assets/json/health"; // 性別（男1女2）

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
    color: "#FF6B6B",
  },
  {
    name: "基隆市",
    color: "#4ECDC4",
  },
  {
    name: "新北市",
    color: "#45B7D1",
  },
  {
    name: "桃園縣",
    color: "#FFA07A",
  },
  {
    name: "宜蘭縣",
    color: "#98D8C8",
  },
  {
    name: "新竹縣",
    color: "#F7DC6F",
  },
  {
    name: "新竹市",
    color: "#BB8FCE",
  },
  {
    name: "苗栗縣",
    color: "#82E0AA",
  },
  {
    name: "彰化縣",
    color: "#F1948A",
  },
  {
    name: "台中市",
    color: "#85C1E9",
  },
  {
    name: "南投縣",
    color: "#F8C471",
  },
  {
    name: "雲林縣",
    color: "#73C6B6",
  },
  {
    name: "嘉義縣",
    color: "#E59866",
  },
  {
    name: "嘉義市",
    color: "#FAD7A0",
  },
  {
    name: "屏東縣",
    color: "#D7BDE2",
  },
  {
    name: "台南市",
    color: "#A3E4D7",
  },
  {
    name: "高雄市",
    color: "#F5B7B1",
  },
  {
    name: "台東縣",
    color: "#AED6F1",
  },
  {
    name: "花蓮縣",
    color: "#F9E79F",
  },
  {
    name: "澎湖縣",
    color: "#A2D9CE",
  },
  {
    name: "金門縣",
    color: "#D2B4DE",
  },
  {
    name: "連江縣",
    color: "#FADBD8",
  },
]);

const handleActive = (label) => {
  console.log(label, "label");
};

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
        center: [120, 24], //設置中心點
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

/** 設置縣市訊息
 * 1. 切換縣市的資料
 * 2. setOption 重新設置地圖資訊
 */
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
              areaColor: region.name === name ? region.color : "#ffffff",
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
.map-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.map-data {
  width: 50%;
  padding: 20px;
}

.map-taiwan {
  width: 50%;
  height: 100%;
  background: #e4faff;
}

ul {
  background: #ffff;
  display: flex;
  justify-content: flex-start;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

ul li {
  font-size: 16px;
  list-style: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: left;
}

ul li span {
  display: block;
  width: 20px;
  height: 10px;
  border-radius: 5px;
  margin-right: 5px;
}
</style>
