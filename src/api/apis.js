import comm from './apiData/comm' // 公共
import cartoon from './apiData/cartoon' // 漫画
import system from './apiData/system' // 系统

const $api = {
  ...comm,
  ...cartoon,
  ...system,
}
export default $api
