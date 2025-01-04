<template>
  <header class="wrap_header no-print">
    <nav class="content_nav">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-sub-menu index="1">
          <template #title>測試</template>
          <el-menu-item
            v-for="(item, index) in navData"
            :key="`${index}`"
            :index="`1-${index}`"
          >
            <router-link :to="item.path">
              {{ item.meta.title }}
            </router-link>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const navData = router.options.routes;

const activeIndex = ref("1");
const handleSelect = (key, keyPath) => {};
</script>

<style lang="scss" scoped>
@media print {
  .no-print {
    display: none;
  }
}

.wrap_header {
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 5px 0px 10px 0px rgb(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  margin-bottom: 20px;
}

.content_nav {
  width: 98%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.header_logo {
  width: 3%;
}

.nav_list {
  display: flex;
}

.nav_logo {
  width: 30px;
}

a {
  width: 100%;
}
</style>
