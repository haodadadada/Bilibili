import { createRouter, createWebHashHistory  } from 'vue-router';
const routes = [
  {
    path: '/',
    redirect: '/video'
  },
  {
    path: '/video',
    component: () => import('@/player_views/video/index.vue'),
  },
  {
    path: '/live',
    component: () => import('@/player_views/live/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;