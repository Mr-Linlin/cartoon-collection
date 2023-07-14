import Vue from 'vue'
import Router from 'vue-router'
import common from './routerData/common' // 公共页面
import FilterRouteList from './FilterRouteList'

// import dynamic from './routerData/dynamic' // 公共页面

Vue.use(Router)

/**
 * meta参数介绍
 * isAuth: 是否需要登录
 * hiddenComm: 是否隐藏公共组件(导航栏+顶部head)
 */

/* 通用routers*/
export const currencyRoutes = [...common]
const router = new Router({
  mode: 'history',
  routes: currencyRoutes,
})

// 导航守卫
let isF = false
router.beforeEach(async (to, from, next) => {
  // document.title = to.meta.title
  const token = localStorage.getItem('ACCESS_TOKEN')
  if (!token) {
    if (to.name === 'login') {
      document.title = '登录注册'
      next()
    } else {
      router.push('login')
      next()
    }
  } else {
    document.title = '数据采集平台'
    if (isF) {
      // console.log('缓存路由', isF);
      next();
    } else {
      let menus = localStorage.getItem('MENUS')
      menus = JSON.parse(menus)
      // 防止刷新页面空白，添加动态路由
      new FilterRouteList(menus)
      isF = true
      next({ ...to, replace: true })

    }
  }
})
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
