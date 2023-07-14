import layui from '@/components/layout/index.vue'

export default [
  {
    path: '/cartoon-manager',
    name: '漫画管理',
    component: layui,
    redirect: '/cartoon-manager',
    children: [
      {
        path: '/cartoon-category',
        name: '漫画分类',
        meta: { title: '漫画分类', keepAlive: true },
        component: () => import(`@/views/cartoonManager/category/index.vue`),
      },
      {
        path: '/product-list',
        name: '漫画列表',
        meta: { title: '漫画列表', keepAlive: true },
        component: () => import(`@/views/cartoonManager/cartoon-list/index.vue`),
      }
    ]
  },
  {
    path: '/datacenter',
    name: '数据中心',
    component: layui,
    redirect: '/datacenter',
    children: [
      {
        path: '/cartoon-collection',
        name: '漫画采集',
        meta: { title: '漫画采集', keepAlive: true },
        component: () => import(`@/views/datacenter/cartoon-collection/index.vue`),
      }
    ]
  },
  {
    path: '/cartoon-set',
    name: '系统管理',
    component: layui,
    redirect: '/cartoon-set',
    children: [
      {
        path: '/system/account',
        name: '账号管理',
        meta: { title: '账号管理', keepAlive: true },
        component: () => import('@/views/system/account/index.vue')
      },
      {
        path: '/system/role',
        name: '角色管理',
        meta: { title: '角色管理', keepAlive: true },
        component: () => import('@/views/system/role/index.vue')
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        meta: { title: '菜单管理', keepAlive: true },
        component: () => import('@/views/system/menu/index.vue')
      }
    ]
  },
]
