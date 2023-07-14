<template>
  <el-select
    v-model="selectedOption"
    filterable
    size="medium"
    :loading="isLoading"
  >
    <el-option
      v-for="(option, index) in options"
      :key="option[value]"
      :label="option[label]"
      :value="option[value]"
    >
      <span>{{ option[label] }}</span>
    </el-option>
    <el-pagination
      v-if="total > pageSize"
      class="my-select-page__pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next, jumper"
      :pager-count="5"
      :page-count="pageCount"
      :disabled="isLoading"
      @current-change="handlePageChange"
    >
      <span v-for="(page,index) in visiblePages" :key="index">
        <span v-if="page === '...'">...</span>
        <el-pagination-item v-else-if="page">{{ page }}</el-pagination-item>
      </span>
    </el-pagination>

  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    label: {
      type: String,
      default: 'label',
    },
    value: {
      type: String,
      default: 'id',
    },
  },
  data() {
    return {
      selectedOption: '',
      searchText: '',
      currentPage: 1,
      isLoading: false,
    }
  },
  computed: {
    filteredOptions() {
      if (this.searchText) {
        return this.options.filter((option) =>
          option.label.toLowerCase().includes(this.searchText.toLowerCase()),
        )
      }
      return this.options
    },
    total() {
      return this.filteredOptions.length
    },
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    visiblePages() {
      const result = []
      // 首页
      result.push(1)
      if (this.currentPage > 3) {
      // 前面的省略号
        result.push('...')
      }
      // 中间的页码
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
        result.push(i)
      }
      if (this.currentPage < this.totalPages - 2) {
      // 后面的省略号
        result.push('...')
      }
      // 尾页
      result.push(this.totalPages)
      return result
    },
    pageCount() {
      return Math.ceil(this.total / this.pageSize)
    },
  },
  watch: {
    // 监听父组件中的 options 变化，重置分页数据
    options: {
      immediate: true,
      handler() {
        this.searchText = ''
        this.currentPage = 1
        this.selectedOption = this.options[0][this.value]
      },
    },
  },
  methods: {
    handlePageChange(currentPage) {
      this.currentPage = currentPage
    },
  },
}
</script>

<style scoped>
<style>
  .my-select-page{
    position:relative;
    height:200px;
  }
  .my-select-page__pagination {
    position: absolute;
    bottom: 0;
    margin-top: 10px;
  }
</style>
</style>
