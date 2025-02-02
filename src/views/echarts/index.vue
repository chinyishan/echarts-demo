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
              {{ regionsGenderData.male + regionsGenderData.female }}人
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
          <div class="age-Colum" ref="ageColumRef"></div>
        </div>
      </div>
      <div class="map-taiwan" ref="mapTaiwanRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import * as echarts from "echarts";
import taiwanJSON from "@/assets/json/taiwan.json";
import { countyTown } from "@/assets/json/county-town.json";
import { health } from "@/assets/json/health"; // 性別（男1女2）
import { age } from "@/assets/json/age"; // 性別（男1女2）

const params = reactive({
  county: "南投縣",
  town: "",
});

const regionsData = computed(() => {
  let result = [];
  result = health.filter((item) => item["county"] == params.county);
  return result;
});

console.log(regionsData.value, "regionsData");

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

console.log(regionsAgeData.value, "regionsAgeData");

const mapTaiwanRef = ref();
const mapTaiwanChart = ref(null);

/** 繪製地圖 */
const drawMap = async () => {
  // Ref 掛載 DOM 物件
  mapTaiwanChart.value = echarts.init(mapTaiwanRef.value);
  echarts.registerMap("taiwan", taiwanJSON); // 注册可用的地圖

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
        // 高光設定
        emphasis: {
          disabled: true, // 禁用高亮效果
        },
        select: {
          disabled: true, // 禁用选中效果
        },
        label: {
          show: true,
          distance: 100,
          color: "#000", // 文字顏色
          // borderWidth: 2,
          borderColor: "#000",
          fontSize: 12,
          fontWeight: "400",
        },
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
    // 工具提示: hover顯示
    tooltip: {
      trigger: "item",
      formatter: "{b}",
    },
  };
  mapTaiwanChart.value.setOption(option);
};

const genderPieRef = ref();
const genderChart = ref(null);

/** 性別圓餅圖 */
const drawGenderPie = async () => {
  genderChart.value = echarts.init(genderPieRef.value);

  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
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
        label: {
          show: false,
          position: "center",
        },
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
  genderChart.value.setOption(option);
};

const ageColumRef = ref();
const ageColumChart = ref(null);

const drawAgeColum = async () => {
  ageColumChart.value = echarts.init(ageColumRef.value);

  const peopleData = [];

  regionsData.value.forEach((item) => {
    peopleData.push(item.people);
  });

  const option = {
    // 顯示
    tooltip: {
      trigger: "axis",
    },
    // 邊距
    grid: {
      top: "10%",
      bottom: "10%",
      left: "8%",
      right: "2%",
    },
    xAxis: {
      type: "category",
      data: age, // X 軸顯示標題，string[]
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => `${value}人`,
      },
    },
    series: [
      {
        name: "年齡",
        type: "bar",
        barWidth: "40%",
        itemStyle: {
          color: "#BB8FCE", // 設置顏色
        },
        data: regionsAgeData.value,
      },
    ],
    // 顯示提示框组件
    tooltip: {
      show: true,
    },
  };
  ageColumChart.value.setOption(option);
};

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
    color: "#FBDBD2",
  },
]);

/** 點擊地區重置資料 */
const handleActive = (label) => {
  params.county = label;
  setMapTaiwan(label);
  setGenderPie(label);
};

// 散點座標
const scatter = reactive([
  {
    name: "大樹醫藥股份有限公司-總部",
    value: [24.990994405686934, 121.31154760370656],
  },
]);

/** 設置縣市訊息
 * 1. 切換縣市的資料
 * 2. setOption 重新設置地圖資訊
 */
const setMapTaiwan = (name) => {
  mapTaiwanChart.value.setOption({
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
const setGenderPie = (name) => {
  genderChart.value.setOption({
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
  window.addEventListener("resize", function () {
    mapTaiwanChart.value.resize();
    genderChart.value.resize();
    ageColumChart.value.resize();
  });
  drawMap();
  drawGenderPie();
  drawAgeColum();
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

.map-taiwan {
  width: 50%;
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
  gap: 20px;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e9e9e9;
  margin-bottom: 20px;
}

.data-wrap .data-gender .gender-pie {
  width: 280px;
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
