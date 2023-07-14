/**
 * 时间戳转日期
 * @param time {Number} 转换的时间戳对象
 * @param type {String} 日期格式
 * @param isAll {Boolean} 显示完整时间
 * @return {String}
 */
export const formatDate = (time, type, isAll) => {
  if (time) {
    time = time * 1000
    var date = new Date()
    date.setTime(time)
    var year = date.getFullYear()
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) * 1 : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    if (type === '-') {
      return isAll
        ? year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        : year + '-' + month + '-' + day
    } else if (type === '/') {
      return year + '/' + month + '/' + day
    } else if (type === '.') {
      return year + '.' + month + '.' + day
    } else {
      return year + '年' + month + '月' + day + '日'
    }
  }
}

// 千分位数值格式化（123456789 = 123,456,789）
function thousandFormat(num) {
  let numStr = num.toString()
  const index = numStr.indexOf('-')
  if (index === 0) {
    numStr = numStr.substring(1, numStr.length)
  }
  num = parseFloat(numStr)
  const boo = String(num).indexOf('.')
  boo >= 0 ? num = num.toFixed(2) : ''
  num += ''
  const decimal = num.split('.')[1]
  let integer = num.split('.')[0]
  let result = ''
  while (integer.length > 3) {
    result = ',' + integer.slice(-3) + result
    integer = integer.slice(0, integer.length - 3)
  }
  integer ? result = integer + result : ''
  decimal ? result += '.' + decimal : ''
  if (index === 0) {
    result = '-' + result
  }
  return result
}
/* 格式化数字 (12345 = 1.23w) */
export const numberFormatting = function(num) {
  if (num === undefined || isNaN(Number(num))) {
    return '--'
  }
  num = Number(num)
  let result = ''
  if (num < 10000) {
    result = thousandFormat(num)
  } else {
    const numThousand = parseFloat(num / 10000).toFixed(2)
    result = numThousand + 'w'
  }
  return result
}

/* 格式化数字（1234.5678 = 1234.56) */
export const numberFormattingFixed = function(num) {
  if (num === undefined || isNaN(Number(num))) {
    return num
  }
  num = Number(num)
  const boo = String(num).indexOf('.')
  boo >= 0 ? num = num.toFixed(2) : ''
  num += ''
  const decimal = num.split('.')[1]
  let integer = num.split('.')[0]
  let result = ''
  while (integer.length > 3) {
    result = ',' + integer.slice(-3) + result
    integer = integer.slice(0, integer.length - 3)
  }
  integer ? result = integer + result : ''
  decimal ? result += '.' + decimal : result += '.00'
  return result
}

/* 将大数字改为如'12.3w 1.3亿'的格式*/
export const normalizeBigNumer = function(num) {
  let boo = false
  if (num || num === 0) {
    boo = !isNaN(+num) // 如果不是数字直接返回0
  } else { // 如果为空直接返回0
    boo = false
  }
  const f = 0 // 小数点位数
  if (boo) {
    if (num >= 100000000) {
      num = (num / 100000000).toFixed(f) + '亿' // tofixed('')保留小数位数
      return num
    } else if (num >= 10000000) {
      num = (num / 10000000).toFixed(f) + '000w+'
      return num
    } else if (num >= 1000000) {
      num = (num / 1000000).toFixed(f) + '00w+'
      return num
    } else if (num >= 100000) {
      num = (num / 10000).toFixed(f) + 'w+'
      return num
    } else {
      const boo = String(num).indexOf('.')
      boo >= 0 ? num = num.toFixed(2) : ''
      num += ''
      const decimal = num.split('.')[1]
      let integer = num.split('.')[0]
      let result = ''
      while (integer.length > 3) {
        result = ',' + integer.slice(-3) + result
        integer = integer.slice(0, integer.length - 3)
      }
      integer ? result = integer + result : ''
      decimal ? result += '.' + decimal : ''
      return result
    }
  } else {
    return '--'
  }
}

