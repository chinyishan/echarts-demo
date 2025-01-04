import { createRouter, createWebHistory } from 'vue-router'; //createWebHashHistory

export const routes = [
  {
    path: '/',
    redirect: '/echarts',
  },
  {
    path: '/echarts',
    name: 'echarts',
    component: () => import('@/views/echarts/index.vue'),
    meta: { title: 'echarts圖表' },
  },
];

const router = createRouter({
  // 4. 內部提供了 history 模式的實作。
  history: createWebHistory(),
  routes, // `routes: routes` 的縮寫
});

export default router;
