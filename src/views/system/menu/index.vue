<template>
  <div class="volume">
    <div ref="header" class="header-content">
      <el-button type="primary" size="mini" @click="dialogFormVisible = true">新增路由</el-button>
    </div>
    <div class="table-wrap">
      <l-table :data="tableData" :loading="loading" :columns="columns" :height="tableHeight" :total="total"
        :pagination-flag="true" :select-flag="true" :serial-flag="true" @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange">
        <template slot="type" slot-scope="{ scope }">
          {{ scope.parent_id == 0 ? '顶级菜单' : '普通路由' }}
        </template>
        <template slot="icon" slot-scope="{ scope }">
          <span v-if="scope.svg" :class="scope.svg" class="lin"></span>
          <span v-else>{{ scope.svg }}</span>
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
          <div class="label">节点名称：</div>
          <div class="info">
            <el-input v-model="form.name" placeholder="请输入" size="small" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">路由：</div>
          <div class="info">
            <el-input v-model="form.path" placeholder="请输入" size="small" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">菜单图标：</div>
          <div class="info">
            <el-input v-model="form.svg" placeholder="请输入" size="small" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">节点类型：</div>
          <div class="info">
            <el-select v-model="form.parent_id" size="small">
              <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
      title: '新增路由',
      formLabelWidth: '120px',
      dialogFormVisible: false,
      defalut_img:
        'https://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2022113011491721984.jpg',
      queryInfo: {
        page: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
      loading: false,
      columns: [
        {
          attar: {
            label: '路由名称',
            prop: 'name',
          },
        },
        {
          attar: {
            label: '路由',
            prop: 'path',
          },
        },
        {
          slot: 'type',
          attar: {
            label: '节点类型',
            prop: 'parent_id',
          },
        },
        {
          slot: 'icon',
          attar: {
            label: '菜单图标',
            prop: 'svg',
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
      form: {
        name: '',
        path: '',
        parent_id: '',
        svg: '',
      },
      groupList: [],
      tableHeight: 500,
      roles: [],
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
        const res = await this.$api.getMenus(this.queryInfo)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.groupList = this.tableData.filter(item => item.parent_id == 0)
          this.groupList.push({ id: 0, name: '顶级菜单' })
          this.total = res.data.total
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    // 单个删除
    delRow(id) {
      this.delRowAll([id])
    },
    // 批量删除
    async delRowAll(ids) {
      const res = await this.$api.delMenu({ ids: ids.toString() })
      if (res.code == 200) {
        this.getCartoonCategory()
        return this.$message.success(res.msg)
      }
    },
    editRow(row) {
      this.form = row
      this.title = '修改菜单'
      this.dialogFormVisible = true
    },
    async savaRow() {
      if (!this.form.name || !this.form.path || this.form.parent_id < 0) {
        return this.$message.error('请填写完整信息')
      }
      let res = null
      if (this.form.id) {
        res = await this.$api.editMenu(this.form)
      } else {
        res = await this.$api.addMenu(this.form)
      }
      if (res.code == 200) {
        this.close()
        this.getCartoonCategory()
        return this.$message.success(res.msg)
      } else {
        return this.$message.error(res.msg)
      }
    },
    close() {
      this.dialogFormVisible = false
      this.form = {
        name: '',
        path: '',
        parent_id: '',
        svg: '',
      }
      this.title = '新增路由'
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
      this.queryInfo.page = 1
      this.queryInfo = data
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
