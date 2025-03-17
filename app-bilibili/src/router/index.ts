import { createRouter, createWebHashHistory  } from 'vue-router';
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('@/views/Home/index.vue'),
    children: [
      {path: '', redirect: '/home/recommand'},
      {path: 'live', component: () => import('@/views/Home/Live/index.vue')},
      {path: 'recommand', component: () => import('@/views/Home/Rcmd/index.vue')},
      {
        path: 'hot', 
        component: () => import('@/views/Home/Hot/index.vue'), 
        children: [
          {path: '', redirect: '/home/hot/popular'},
          {path: 'popular', component: () => import('@/views/Home/Hot/Popular/index.vue')},
          {path: 'series', component: () => import('@/views/Home/Hot/Series/index.vue')},
          {path: 'precious', component: () => import('@/views/Home/Hot/Precious/index.vue')},
          {path: 'rank', component: () => import('@/views/Home/Hot/Rank/index.vue')}
        ]
      },
      {path: 'bangumi', component: () => import('@/views/Home/Bangumi/index.vue')},
    ]
  },
  {
    path: '/personal-space', component: () => import('@/views/PersonalSpace/index.vue')
  },
  {
    path: '/setting', component: () => import('@/views/Setting/index.vue')
  },
  {
    path: '/search', component: () => import('@/views/Search/index.vue')
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
