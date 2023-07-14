import { onMounted, reactive } from 'vue'
export function getDynamicHeight(height) {
  const contentStyleObj = reactive({
    height: '',
  })
  const getHeight = () => {
    const windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    return (contentStyleObj.height = windowHeight - height - 200)
  }

  onMounted(() => {
    getHeight()
  })
  return contentStyleObj.height
}
