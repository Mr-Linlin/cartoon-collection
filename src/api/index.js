import axios from 'axios'
import Qs from 'qs'
const { resetMessage } = require('@/util/element')
import router from '@/router'

const $axios = axios.create({
  // 设置超时时间
  timeout: 60000,
  baseURL: 'http://127.0.0.1:7001',
  // process.env.NODE_ENV === 'development' ? '/api' : mainVintedConfig.baseURL,
})

// 请求拦截器
$axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.token = "Bearer " + token; // 请求头部添加token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
$axios.interceptors.response.use(
  (response) => {
    if (response.data) {
      if (response.data.code !== 500 && response.data.code !== 1004) {
        return Promise.resolve(response.data)
      } else {
        resetMessage.error(
          (response.data && response.data.msg) || '请求失败'
        )
        switch (response.data.code) {
          case 401: // 登录失效
            router.push(
              {
                name: 'login',
              },
              () => { }
            )
            localStorage.removeItem('ACCESS_TOKEN')
            return Promise.reject(response)
          default:
            return Promise.reject(response.data)
        }
      }
    } else {
      return Promise.reject(response.data)
    }
  },
  (error) => {
    console.log(error)
    if (error.response) {
      switch (error.response.status) {
        case 404:
          resetMessage.error('网络请求不存在')
          break
        default:
          resetMessage.error(
            error?.response?.data?.data?.msg ||
            error?.response?.data?.message ||
            '请求失败'
          )
      }
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes('timeout')) {
        console.log('请求超时！请检查网络是否正常')
        // resetMessage.error('请求超时！请检查网络是否正常')
      } else {
        console.log('请求失败，请检查网络是否已连接')
        // resetMessage.error('请求失败，请检查网络是否已连接')
      }
    }
    return Promise.reject(error)
  }
)

// get，post请求方法
export default {
  get(url, params) {
    return $axios({
      method: 'get',
      url,
      params,
    })
  },
  post(url, data) {
    return $axios({
      method: 'post',
      url,
      data: Qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
  },
  postJson(url, data) {
    return $axios({
      method: 'post',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  upload(url, data) {
    return $axios({
      method: 'post',
      url,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
