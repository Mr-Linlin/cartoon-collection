import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store'
import '@/util/element'
import '@/assets/css/init.css'
import $api from '@/api/apis'
import VueI18n from 'vue-i18n'
import enLang from '@/i18n/lang/en.js'
import VueLazyLoad from 'vue-lazyload'
import md5 from 'js-md5'
import VueCookies from 'vue-cookies'
import { getTableHeight } from '@/util/utils.js'
import LTable from '@/components/Table/index.vue'
import SearchForm from '@/components/SearchForm'
import moment from 'moment'
import vSelectPage from 'v-selectpage'
// import vSelectPage from '@/views/dashboard/select/index.js'
// 全局挂载 VueQuillEditor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/css/font-icon/iconfont.css'

// 引入拖拽排序插件
import VueDND from 'awe-dnd'
import VueCropper from 'vue-cropper'

const language = {
  en: enLang,
}
Vue.component('LTable', LTable)
Vue.component('SearchForm', SearchForm)
Vue.use(VueQuillEditor)
Vue.use(VueDND)
Vue.use(VueI18n)
Vue.use(VueCookies)
Vue.use(vSelectPage)
Vue.use(VueLazyLoad, {
  error: require('@/assets/images/comm/img_error.png'),
})
// });
Vue.use(VueCropper)
const localLang = getCookie('local_lang') || 'zh'
const i18n = new VueI18n({
  locale: localLang,
  fallbackLocale: 'zh',
  formatFallbackMessages: true,
  messages: language,
  silentTranslationWarn: true,
})
// rewirteLog(); // 去除正式日志打印
Vue.config.productionTip = false
Vue.prototype.$api = $api // 全局api请求
Vue.prototype.$md5 = md5
Vue.prototype.$getTableHeight = getTableHeight
Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

function getCookie(name) {
  const nameEQ = name + '='
  const ca = document.cookie.split(';') // 把cookie分割成组
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i] // 取得字符串
    while (c.charAt(0) === ' ') {
      // 判断一下字符串有没有前导空格
      c = c.substring(1, c.length) // 有的话，从第二位开始取
    }
    if (c.indexOf(nameEQ) === 0) {
      // 如果含有我们要的name
      return unescape(c.substring(nameEQ.length, c.length)) // 解码并截取我们要值
    }
  }
  return false
}
