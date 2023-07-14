import layui from '@/components/layout/index.vue'

export default [
  {
    path: '/',
    name: '首页',
    component: layui,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import(`@/views/dashboard/index.vue`),
        name: '首页',
        meta: { title: '首页', is_new: 1 },
      },
    ],
  },
  // 登录注册页
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index.vue'),
  },
]
