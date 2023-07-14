import axios from '../index'
export default {
  // 漫画分类
  getCartoonCategory(params) {
    const url = '/api/product/getCtcategory'
    return axios.get(url, params)
  },
  addCategory(params) {
    const url = '/api/cartoon/addCategory'
    return axios.post(url, params)
  },
  editCategory(params) {
    const url = '/api/product/editCtcategory'
    return axios.post(url, params)
  },
  deleteCtcategory(params) {
    const url = '/api/product/deleteCtcategory'
    return axios.post(url, params)
  },
  getCartoonList(params) {
    const url = '/api/product/getCartoonList'
    return axios.get(url, params)
  },
  // 漫画
  addCartoon(params) {
    const url = '/api/product/addCartoon'
    return axios.post(url, params)
  },
  editCartoon(params) {
    const url = '/api/product/editCartoon'
    return axios.post(url, params)
  },
  deleteCartoon(params) {
    const url = '/api/product/deleteCartoon'
    return axios.post(url, params)
  },
  // 章节
  addChapter(params) {
    const url = '/api/cartoon/addChapter'
    return axios.post(url, params)
  },
  getChapterList(params) {
    const url = '/api/cartoon/getChapterList'
    return axios.get(url, params)
  },
}
