import axios from '../index'
export default {
  getAccounts(params) {
    const url = '/api/system/account'
    return axios.get(url, params)
  },
  addAccount(params) {
    const url = '/api/system/addAccount'
    return axios.post(url, params)
  },
  editAccount(params) {
    const url = '/api/system/editAccount'
    return axios.post(url, params)
  },
  delAccount(params) {
    const url = '/api/system/deleteAccount'
    return axios.post(url, params)
  },
  // 角色模块
  getRoles(params) {
    const url = '/api/system/role'
    return axios.get(url, params)
  },
  addRole(params) {
    const url = '/api/system/addRole'
    return axios.post(url, params)
  },
  editRole(params) {
    const url = '/api/system/editRole'
    return axios.post(url, params)
  },
  delRole(params) {
    const url = '/api/system/deleteRole'
    return axios.post(url, params)
  },
  // 菜单模块
  getMenus(params) {
    const url = '/api/getMenus'
    return axios.get(url, params)
  },
  addMenu(params) {
    const url = '/api/addMenus'
    return axios.post(url, params)
  },
  editMenu(params) {
    const url = '/api/system/editMenu'
    return axios.post(url, params)
  },
  delMenu(params) {
    const url = '/api/system/delMenu'
    return axios.post(url, params)
  },
}
