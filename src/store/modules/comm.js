import api from '@/api/apis'
import { resetMessage } from '@/util/element'
import router from '@/router'
import FilterRouteList from '@/router/FilterRouteList'

const state = {
  tabsList: '' || JSON.parse(sessionStorage.getItem('routerTag')) || [],
  role: '' || localStorage.getItem('role'),
  userName: '' || localStorage.getItem('username'),
}
const mutations = {
  // 选择路由标签
  selectMenu(state, val) {
    // console.log(val, '====')
    if (val.path !== '/new') {
      // 如果等于-1说明tabsList不存在那么插入，否则什么都不做
      if (state.tabsList) {
        const result = state.tabsList.findIndex(
          (item) => item.name === val.name
        )
        if (state.tabsList.length > 11) {
          state.tabsList.splice(1, 1)
        }
        result === -1 ? state.tabsList.push(val) : ''
      } else {
        state.tabsList = []
      }
      // console.log(state.tabsList, '====')
      sessionStorage.setItem('routerTag', JSON.stringify(state.tabsList))
    }
  },
  // 关闭路由标签
  closeTab(state, val) {
    const result = state.tabsList.findIndex((item) => item.path === val.path)
    state.tabsList.splice(result, 1)
    sessionStorage.setItem('routerTag', JSON.stringify(state.tabsList))
  },
  // 初始化信息
  setConfig(state, res) {
    localStorage.setItem("ACCESS_TOKEN", res.token)
    localStorage.setItem("USERINFO", JSON.stringify(res.userInfo))
    localStorage.setItem("MENUS", JSON.stringify(res.menus))
    resetMessage.success('登录成功！')
    new FilterRouteList(res.menus)
    router.push({ path: '/home' })
  },
}
const actions = {
  async logOut() {
    const res = await api.loginOut()
    if (res.code === 200) {
      // 需要清除的存储
      const localStorageName = [
        'username',
        'menu',
        'token',
        'config',
        'uid',
        'contact',
        'platformList',
        'role',
      ]
      localStorageName.forEach((item) => {
        localStorage.removeItem(item)
      })
      this.$notify({
        title: '成功',
        message: '退出登录成功',
        type: 'success',
      })
      location.reload()
    }
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
