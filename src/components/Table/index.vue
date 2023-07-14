<template>
  <div class="l-tabel">
    <el-table
      v-loading="loading"
      v-bind="$attrs"
      :data="data"
      tooltip-effect="dark"
      :header-cell-style="headerCellStyle"
      style="width: 100%"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      :height="height"
      :expand-row-keys="expandList"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @row-click="showProductSku"
    >
      <el-table-column v-if="selectFlag" type="selection" width="60" fixed />
      <template v-if="serialFlag">
        <el-table-column v-if="paginationFlag" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 + (pagination.page - 1) * pagination.pageSize }}
          </template>
        </el-table-column>
        <el-table-column v-else label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
      </template>
      <template v-for="(item, index) in columns">
        <el-table-column v-if="!item.slot" :key="index" v-bind="item.attar" />
        <el-table-column v-else :key="index" v-bind="item.attar || {}">
          <template slot-scope="scope">
            <slot :name="item.slot" :scope="scope.row" />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="paginationFlag" class="pagination">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        background
        layout="sizes,prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <span style="margin-right: 5px">当前共{{ total }}条</span>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    rowStyle: {
      type: Object,
      default: () => {
        return {
          height: '50px',
        }
      },
    },
    cellStyle: {
      type: Object,
      default: () => {
        return { textAlign: 'center' }
      },
    },
    headerCellStyle: {
      type: Object,
      default: () => {
        return { textAlign: 'center', backgroundColor: '#f5f7fa' }
      },
    },
    height: {
      type: Number,
      default: 500,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    selectFlag: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    serialFlag: {
      type: Boolean,
      default: false,
    },
    paginationFlag: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => {
        return {
          page: 1,
          pageSize: 10,
          pageSizes: [10, 50, 100, 300],
        }
      },
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      expandList: [],
      tableData: this.data,
    }
  },
  // watch: {
  //   tableData: {
  //     handler(newV, oldV) {
  //       console.log(newV, 'jiantin ')
  //       this.tableData = newV
  //       console.log(this.tableData)
  //     },
  //     deep: true,
  //   },
  // },
  mounted() {
    console.log(this.total, '===', this.tableData, this.columns)
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('selectionChange', val)
    },
    handleSizeChange(val) {
      // console.log(`${val} i`)
      this.$emit('sizeChange', val)
    },
    handleCurrentChange(val) {
      // console.log(`${val} items`)
      this.$emit('currentChange', val)
    },
    showProductSku(row) {
      if (this.expandList.indexOf(row.id) === -1) {
        this.expandList = [row.id]
      } else {
        this.expandList = []
      }
    },
  },
}
</script>

<style scoped lang="less">
.pagination {
  margin: 15px;
  display: flex;
  justify-content: right;
}
</style>
