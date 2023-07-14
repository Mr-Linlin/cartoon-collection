import axios from '../index'
export default {
  searchKey(params) {
    const url = '/api/searchKey'
    return axios.get(url, params)
  },
  queryDetailById(params) {
    const url = '/api/queryDetailById'
    return axios.post(url, params)
  },
  queryCartoon(params) {
    const url = '/api/getCartoonLink'
    return axios.post(url, params)
  },
  uploadFile(params) {
    const url = '/api/ali/uploadFile'
    return axios.upload(url, params)
  },
  login(params) {
    const url = '/user/login'
    return axios.post(url, params)
  },
  register(params) {
    const url = '/user/reg'
    return axios.post(url, params)
  },
}
