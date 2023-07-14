<template>
  <div class="table">
    <el-table
      :data="tableRowData"
      border
      style="width: 100%"
      :span-method="mergeRowMethod"
    >
      <el-table-column align="center" prop="sort" label="编号" />
      <el-table-column align="center" prop="conunt" label="数量" />
      <el-table-column align="center" prop="name" label="名称内容" />
      <el-table-column align="center" prop="sku" label="名称内容" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MyTable',
  data() {
    return {
      tableRowData: [],
      activeName: 'row',
      originData: [
        {
          sort: '01',
          conunt: '2',
          children: [
            {
              name: '01-1号',
              sku: '111',
            },
            {
              name: '01-2号',
              sku: '222',
            },
          ],
        },
        {
          sort: '02',
          conunt: '2',
          children: [
            {
              name: '02-1号',
              sku: '222',
            },
          ],
        },
      ],
    }
  },
  watch: {
    activeName: {
      handler(val) {
        if (val == 'row') {
          this.loadRowData()
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 合并行
    mergeRowMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(rowIndex, column)
      if ([0, 1].includes(columnIndex)) {
        return {
          rowspan: row.rowNum, // 待合并行数 -- 合并的行数长度就等于之前赋值的子数据的长度；未赋值的即表示0，不显示
          colspan: row.rowNum > 0 ? 1 : 0, // 待合并列数 -- 合并的列数自身占一列，被合并的要返回0，表示不显示
        }
      }
    },
    loadRowData() {
      this.tableRowData = []
      const originArr = JSON.parse(JSON.stringify(this.originData))
      // 普通的数据转换，将后台格式转换成element表格需要的格式
      if (Array.isArray(originArr)) {
        originArr.map((res) => {
          if (Array.isArray(res.children)) {
            res.children.map((subRes, subIndex) => {
              let content = {}
              content = subRes
              content['sort'] = res.sort
              content['conunt'] = res.conunt
              if (subIndex == 0) {
                content['rowNum'] = res.children.length
              }
              this.tableRowData.push(content)
            })
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.table {
  position: absolute;
  width: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.row-highlight {
  background-color: #f7f7f7;
}
</style>
