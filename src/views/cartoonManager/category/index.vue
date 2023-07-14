<template>
  <div class="volume">
    <div ref="header" class="header-content">
      <search-form :form="formColumns" :query="queryInfo" btn-text="搜索" @seachForm="seachForm">
        <template slot="btnSlot">
          <el-button type="primary" size="mini" @click="dialogFormVisible = true">添加分类</el-button>
        </template>
      </search-form>
    </div>
    <div class="table-wrap">
      <l-table :data="tableData" :loading="loading" :columns="columns" :height="tableHeight" :total="total"
        :select-flag="true" :serial-flag="true" :pagination-flag="true" @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange">
        <template slot="cover" slot-scope="{ scope }">
          <el-tooltip effect="light" placement="right-end" :visible-arrow="false" :enterable="false"
            style="margin: 0 auto">
            <div slot="content">
              <img v-lazy="scope.cover_img ? scope.cover_img : defalut_img" height="400px" />
            </div>
            <div class="goods-image">
              <img v-if="scope.cover_img" :src="scope.cover_img" alt="" height="50px" />
              <img v-else :src="defalut_img" alt="" height="50px" />
            </div>
          </el-tooltip>
        </template>
        <template slot="operate" slot-scope="{ scope }">
          <el-button type="primary" size="mini" @click="editRow(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delRow(scope.id)">删除</el-button>
        </template>
      </l-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
      <div class="content">
        <div class="form-item">
          <div class="label">分类名称：</div>
          <div class="info">
            <el-input v-model="form.name" placeholder="请输入" size="small" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="savaRow">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '添加分类',
      formLabelWidth: '120px',
      dialogFormVisible: false,
      defalut_img:
        'https://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2022113011491721984.jpg',
      queryInfo: {
        page: 1,
        pageSize: 10,
        category_name: '',
      },
      form: {
        name: '',
      },
      formColumns: [
        {
          tag: 'el-input',
          attrs: {
            placeholder: '请输入',
            clearable: true,
            size: 'mini',
          },
          label: '分类名称：',
          key: 'name',
        },
      ],
      tableData: [],
      total: 0,
      loading: false,
      columns: [
        {
          attar: {
            label: 'ID',
            prop: 'id',
            width: 100,
          },
        },
        {
          attar: {
            label: '分类名称',
            prop: 'name',
          },
        },
        {
          slot: 'cover',
          attar: {
            label: '封面',
            prop: 'cover',
            width: 60,
          },
        },
        {
          attar: {
            label: '创建时间',
            prop: 'create_time',
          },
        },
        {
          slot: 'operate',
          attar: {
            label: '操作',
            width: 200,
          },
        },
      ],
      tableHeight: 500,
    }
  },
  created() {
    this.init()
    this.getCartoonCategory()
  },
  methods: {
    async init() {
      this.$nextTick(() => {
        const headerH = this.$refs.header.offsetHeight
        this.tableHeight = this.$getTableHeight(headerH)
      })
    },
    async getCartoonCategory() {
      this.loading = true
      try {
        const res = await this.$api.getCartoonCategory(this.queryInfo)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.tableData.forEach((item) => {
            item.create_time = this.$moment(item.create_time).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })
          this.total = res.data.total
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    close() {
      this.dialogFormVisible = false
      this.form = {
        name: '',
      }
      this.title = '添加分类'
    },
    editRow(row) {
      this.form = {
        id: row.id,
        name: row.name,
      }
      this.title = '修改分类'
      this.dialogFormVisible = true
    },
    async savaRow() {
      if (!this.form.name) {
        return this.$message.error('分类名称不能为空')
      }
      let res = null
      if (this.form.id) {
        res = await this.$api.editCategory(this.form)
      } else {
        res = await this.$api.addCategory(this.form)
      }
      if (res.code == 200) {
        this.close()
        this.getCartoonCategory()
        return this.$message.success(res.msg)
      } else {
        return this.$message.error(res.msg)
      }
    },
    // 单个删除
    delRow(id) {
      this.delRowAll([id])
    },
    // 批量删除
    async delRowAll(ids) {
      const res = await this.$api.deleteCtcategory({ ids: ids.toString() })
      if (res.code == 200) {
        this.getCartoonCategory()
        return this.$message.success(res.msg)
      }
    },
    handleSizeChange(val) {
      console.log(val, 111)
      this.queryInfo.pageSize = val
      this.getCartoonCategory()
    },
    handleCurrentChange(val) {
      console.log(val, 222)
      this.queryInfo.page = val
      this.getCartoonCategory()
    },
    selectionChange(val) {
      console.log(val)
    },
    seachForm(data) {
      this.queryInfo = data
      this.queryInfo.page = 1
      this.getCartoonCategory()
    },
  },
}
</script>
<style lang="less" scoped>
.volume {
  margin-left: 15px;
}
</style>
