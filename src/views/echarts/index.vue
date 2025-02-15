<template>
  <div class="app-container">
    <div class="map-wrap">
      <div class="map-data">
        <h1>全國人口參加健保人數</h1>
        <ul class="county-wrap">
          <li
            v-for="(item, index) in countyTown"
            :key="index"
            @click="handleActive(item.label)"
            :style="{
              background: item.label === params.county ? '#bbb' : '#fff',
            }"
          >
            {{ item.label }}
          </li>
        </ul>
        <div class="data-wrap">
          <div class="data-text">
            <h2>{{ params.county }}</h2>
            <h3>
              縣市總人數 :
              {{
                (
                  regionsGenderData.male + regionsGenderData.female
                ).toLocaleString()
              }}人
            </h3>
            <h3>
              男性總人數 : {{ regionsGenderData.male.toLocaleString() }}人
            </h3>
            <h3>
              女性總人數 : {{ regionsGenderData.female.toLocaleString() }}人
            </h3>
          </div>
          <div class="data-gender">
            <div class="gender-pie" ref="genderPieRef"></div>
          </div>
        </div>
        <div class="age-wrap">
          <div class="age-group">
            <div class="age-Colum" ref="ageColumRef"></div>
          </div>
        </div>
      </div>
      <div class="map-right">
        <div class="map-taiwan" ref="mapTaiwanRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import * as echarts from "echarts";
import taiwanJSON from "@/assets/json/taiwan.json";
import { countyTown } from "@/assets/json/county-town.json";
import { health } from "@/assets/json/health"; // 性別（男1女2）
import { age } from "@/assets/json/age"; // 年齡

const params = reactive({
  county: "南投縣",
  town: "",
});

const regionsData = computed(() => {
  let result = [];
  result = health.filter((item) => item["county"] == params.county);
  return result;
});

/** 地區性別
 * @param male 男性
 * @param female 男性
 */
const regionsGenderData = computed(() => {
  return regionsData.value.reduce(
    (acc, item) => {
      const peopleCount = parseInt(item.people, 10);
      if (item.gender === "1") {
        acc.male += peopleCount;
      }
      if (item.gender === "2") {
        acc.female += peopleCount;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );
});

/** 歲數資料 */
const regionsAgeData = computed(() => {
  // 做同歲數的加總
  const result = regionsData.value.reduce((acc, item) => {
    const peopleCount = parseInt(item.people, 10);
    if (!acc[item.age]) {
      acc[item.age] = 0;
    }
    acc[item.age] += peopleCount;
    return acc;
  }, {});

  return Object.values(result);
});

const mapTaiwanRef = ref();
let mapTaiwanChart = null;

/** 繪製地圖 */
const drawMap = async () => {
  // Ref 掛載 DOM 物件
  mapTaiwanChart = echarts.init(mapTaiwanRef.value);
  echarts.registerMap("taiwan", taiwanJSON); // 注冊可用的地圖

  const option = {
    // 數據系列
    series: [
      {
        type: "map",
        map: "taiwan",
        geoIndex: 1,
        aspectScale: 1, // 調整地圖的寬高比例
        roam: true, //是否允許縮放拖曳
        zoom: 1, //初始化大小
        scaleLimit: {
          //缩放大小限制
          min: 1, //最小
          max: 4, //最大
        },
        center: [120, 24], //設置中心點
        // 高光設定
        emphasis: {
          disabled: true, // 禁用高亮效果
        },
        // 選擇
        select: {
          disabled: true, // 禁用選中效果
        },
        // 標籤
        label: {
          show: true, // 是否顯示
          distance: 100,
          color: "#000", // 文字顏色
          borderColor: "#000",
          fontSize: 12,
          fontWeight: "400",
        },
        // 數據陣列
        data: regions.map((region) => ({
          name: region.name,
          value: 0,
          itemStyle: {
            areaColor: region.name === params.county ? region.color : "#ffffff",
            borderColor: "#aaaa",
            borderWidth: 1,
          },
        })),
      },
    ],
    // hover提示
    tooltip: {
      trigger: "item",
      formatter: "{b}", //字符串模板，{a}（系列名稱），{b}（區域名稱），{c}（合併數值）
    },
  };
  mapTaiwanChart.setOption(option);
};

const genderPieRef = ref();
let genderChart = null;

/** 性別圓餅圖 */
const drawGenderPie = async () => {
  genderChart = echarts.init(genderPieRef.value);

  const option = {
    // 提示框
    tooltip: {
      trigger: "item",
    },
    // 圖例
    legend: {
      top: "5%",
      left: "center",
      textStyle: { fontSize: 16, color: "#555" },
    },
    // 數據系列
    series: [
      {
        name: "人數",
        type: "pie", // 類型
        radius: ["40%", "70%"], // 圓餅圖的半徑: [內圈, 外圈]
        padAngle: 5, // 圓餅圖扇區之間的間隔角度
        color: ["#ea7ccc", "#5470c6"], // 調色盤
        itemStyle: {
          borderRadius: 10, // 扇區圓角
        },
        // 顯示名
        label: {
          show: false,
          position: "center",
        },
        // 高光設定
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        data: [
          { value: regionsGenderData.value.female, name: "女性" },
          { value: regionsGenderData.value.male, name: "男性" },
        ],
      },
    ],
  };
  genderChart.setOption(option);
};

const ageColumRef = ref();
let ageColumChart = null;

/** 年齡分佈柱狀圖 */
const drawAgeColum = async () => {
  ageColumChart = echarts.init(ageColumRef.value);

  const peopleData = [];
  regionsData.value.forEach((item) => {
    peopleData.push(item.people);
  });

  const option = {
    // 邊距
    grid: {
      top: "4%",
      bottom: "4%",
      left: "2%",
      right: "2%",
      containLabel: true, // 刻度標籤不超出範圍
    },
    xAxis: {
      type: "category",
      data: age, // X 軸年齡顯示標題，string[]
      // 指示器配置
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: {
      type: "value",
      // 刻度標籤配置
      axisLabel: {
        formatter: (value) => `${value}人`,
      },
      max: 10000, // 設定最大值
      min: 0, // 設定最小值
    },
    series: [
      {
        name: "年齡",
        type: "bar",
        // barWidth: "40%", // 柱狀寬度
        itemStyle: {
          color: "#BB8FCE",
        },
        data: peopleData,
      },
    ],
    // 提示框组件
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: "{b}: {c}", // 自訂格式
    },
  };
  ageColumChart.setOption(option);
};

/** 地區樣式 */
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
    color: "#FBDBD2",
  },
]);

/** 點擊地區重置資料 */
const handleActive = (label) => {
  params.county = label;
  setGenderPie();
  setAgeColum();
  setMapTaiwan(label);
};

/** 設置年齡分佈 */
const setAgeColum = () => {
  const peopleData = [];

  regionsData.value.forEach((item) => {
    peopleData.push(item.people);
  });

  ageColumChart.setOption({
    series: [
      {
        data: peopleData,
      },
    ],
  });
};

/** 設置縣市訊息
 * 1. 切換縣市的資料
 * 2. setOption 重新設置地圖資訊
 */
const setMapTaiwan = (name) => {
  mapTaiwanChart.setOption({
    series: [
      {
        data: regions.map((region) => ({
          name: region.name,
          value: 0,
          itemStyle: {
            areaColor: region.name === name ? region.color : "#ffffff", // 指改變點擊的縣市顏色
            borderColor: "#aaaa",
            borderWidth: 1,
          },
        })),
      },
    ],
  });
};

/** 設置性別圓餅圖 */
const setGenderPie = () => {
  genderChart.setOption({
    series: [
      {
        data: [
          { value: regionsGenderData.value.female, name: "女性" },
          { value: regionsGenderData.value.male, name: "男性" },
        ],
      },
    ],
  });
};

onMounted(() => {
  drawMap();
  drawGenderPie();
  drawAgeColum();
  window.addEventListener("resize", function () {
    mapTaiwanChart.resize();
    genderChart.resize();
    ageColumChart.resize();
  });
});
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

.map-right {
  width: 50%;
  height: 100%;
}

.map-taiwan {
  width: 100%;
  height: 100%;
  background: #e4faff;
}

h1 {
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 10px;
}

h3 {
  color: #404040;
  padding: 5px 0px;
}

ul {
  background: #ffff;
  display: flex;
  justify-content: flex-start;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e9e9e9;
}

ul li {
  font-size: 16px;
  list-style: none;
  padding: 4px 10px;
  cursor: pointer;
  display: flex;
  align-items: left;
  border-radius: 4px;
}

ul li span {
  display: block;
  width: 20px;
  height: 10px;
  border-radius: 5px;
  margin-right: 5px;
}

.data-wrap {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e9e9e9;
  margin-bottom: 20px;
}

.data-wrap .data-text {
  width: 50%;
  height: auto;
}

.data-wrap .data-gender {
  width: 50%;
  height: auto;
}

.data-wrap .data-gender .gender-pie {
  width: 100%;
  height: 280px;
  background: #ffff;
}

.age-wrap {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e9e9e9;
}

.age-wrap .age-Colum {
  width: 100%;
  height: 280px;
  background: #ffff;
}
</style>
