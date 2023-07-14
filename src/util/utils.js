// import {saveAs} from 'file-saver';
import * as XLXS from 'xlsx'
// import FileSaver from 'file-saver'
// import { ElMessage } from 'element-plus'
/**
 * 复制字符串
 * @param text 复制内容
 */
export async function copyText(text) {
  if (navigator.clipboard) {
    // clipboard api 复制
    navigator.clipboard.writeText(text)
    // ElMessage.success('复制成功')
  } else {
    var textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    // 隐藏此输入框
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'
    // 赋值
    textarea.value = text
    // 选中
    textarea.select()
    // 复制
    document.execCommand('copy', true)
    // ElMessage.success('复制成功')
    // 移除输入框
    document.body.removeChild(textarea)
  }
}
/**
 *
 * @param height 减去的高度
 * @returns 自动计算表格高度
 */
export function getTableHeight(height) {
  const windowHeight =
    document.documentElement.clientHeight || document.body.clientHeight
  console.log(windowHeight, height)
  return windowHeight - height - 200
}
/**
 *
 * @param code 状态码
 * @param data 数据
 * @returns
 */
export function resBody(code = 200, data = {}) {
  return { code, data }
}
// 处理关键词
export function handleKey(key) {
  return key
    .split('\n')
    .map((item) => {
      return item.replace(/(^\s*)|(\s*$)/g, '')
    })
    .filter((item) => item != '')
}
// 导出JSON文件
/**
 *
 * @param obj 导出数据
 */
export function exportJSON(obj) {
  // 将json转换成字符串
  const data = JSON.stringify(obj)
  const blob = new Blob([data], { type: '' })
  // saveAs(blob, 'autoReply.json')
}
// 导入json
/**
 *
 * @param file 导入文件
 */
// export function importJSON(file:File) {
//   const reader = new FileReader()
//   reader.readAsText(file&&file.raw)
//   reader.onload =  res=> {
//     // this.result为读取到的json字符串，需转成json对象
//     const data = JSON.parse(res?.target.result)
//     const {KeyWordPhrase,overReplyTime,autoReplyTime,overReplyText} = data
//     this.KeyWordPhrase = KeyWordPhrase
//     this.overReplyTime = overReplyTime
//     this.autoReplyTime = autoReplyTime
//     this.overReplyText = overReplyText
//     console.log(data,'res')
//   }
// },
/**
 * @param {*} fileName 文件名
 * @return 导出整个table数据
 */
export function exportExcelDataCommon(fileName) {
  // Worksheet名
  const worksheet = `${fileName}${new Date(Date.now() + 8 * 3600 * 1000)
    .toISOString()
    .slice(0, 10)}.xlsx`
  // 导出表格加id,通过id获取要导出的表
  const wb = XLXS.utils.table_to_book(document.getElementById('table'))
  const wbout = XLXS.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array',
  })
  try {
    // FileSaver.saveAs(
    //   new Blob([wbout], {
    //     type: 'application/octet-stream',
    //   }),
    //   worksheet
    // )
  } catch (e) {
    console.log(e)
  }
  return wbout
}
/**
 *
 * @param fileName 文件名
 * @param data 导出的数据
 */
export function exportXls(fileName, data) {
  const worksheet = `${fileName}${new Date(
    Date.now() + 8 * 3600 * 1000
  ).toISOString()}.xlsx`
  // 创建工作表
  const res = XLXS.utils.json_to_sheet(data)
  // 创建工作簿
  const wb = XLXS.utils.book_new()
  // 将工作表放入工作簿中
  XLXS.utils.book_append_sheet(wb, res, 'data')
  // 生成文件并下载
  XLXS.writeFile(wb, `${worksheet}`)
}
export function ImportXlsx(file, type = 0) {
  return new Promise((resolve, reject) => {
    try {
      const files = { 0: file.raw }
      console.log(files[0], 'file')
      const reader = new FileReader()
      reader.readAsArrayBuffer(files[0])
      reader.onload = (e) => {
        const data = e.target && e.target.result
        const workbook = XLXS.read(data, { type: 'binary', cellDates: true })
        const wsname = workbook.SheetNames[0]
        const outdata = XLXS.utils.sheet_to_json(workbook.Sheets[wsname])
        resolve(outdata)
      }
    } catch (error) {
      reject([])
    }
  })
}
// 延迟
export async function delay(time) {
  return new Promise((resolve) => {
    const timeId = setTimeout(() => {
      // console.log(`延迟${time}s`)
      clearTimeout(timeId)
      resolve(true)
    }, time)
  })
}
// 去重
export function reduceData(data, value) {
  const obj = {}
  return data.reduce((cur, next) => {
    obj[next[value]] ? '' : (obj[next[value]] = true && cur.push(next))
    return cur
  }, [])
}
/**
 *
 * @param blob 文件流
 * @param startByte 表示文件起始读取的Byte字节数
 * @param endByte 表示结束读取的字节数
 * @return 切割文件
 */
export async function spliceBlob(blob, startByte, endByte) {
  if (blob.slice) {
    return blob.slice(startByte, endByte)
  }
  // 兼容firefox
  if (blob.mozSlice) {
    return blob.mozSlice(startByte, endByte)
  }
  // 兼容webkit
  if (blob.webkitSlice) {
    return blob.webkitSlice(startByte, endByte)
  }
  return null
}
