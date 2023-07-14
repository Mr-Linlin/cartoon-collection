<template>
  <div class="volume">
    <div ref="header" class="header-content">
      <search-form
        :form="formColumns"
        :query="queryInfo"
        btn-text="搜索"
        @seachForm="seachForm"
      >
        <template slot="btnSlot">
          <el-button
            type="primary"
            size="mini"
            @click="dialogFormVisible = true"
            >新增角色</el-button
          >
        </template>
      </search-form>
    </div>
    <div class="table-wrap">
      <l-table
        :data="tableData"
        :loading="loading"
        :columns="columns"
        :height="tableHeight"
        :total="total"
        :pagination-flag="true"
        :select-flag="true"
        :serial-flag="true"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      >
        <template slot="status" slot-scope="{ scope }">
          <el-switch
            v-model="scope.role_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="0"
            inline-prompt
            @change="onChange(scope.id)"
          />
        </template>
        <template slot="operate" slot-scope="{ scope }">
          <el-button type="primary" size="mini" @click="editRow(scope)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="delRow(scope.id)"
            >删除</el-button
          >
        </template>
      </l-table>
    </div>
    <el-drawer
      ref="drawer"
      :title="title"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="角色名称"
            prop="role_name"
            :label-width="formLabelWidth"
            style="padding: 10px"
          >
            <el-input
              v-model="form.role_name"
              placeholder="请输入"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色值"
            prop="role_value"
            :label-width="formLabelWidth"
            style="padding: 10px"
          >
            <el-input
              v-model="form.role_value"
              placeholder="请输入"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-switch
              v-model="form.role_status"
              inline-prompt
              :active-value="0"
            />
          </el-form-item>
          <el-form-item
            label="备注"
            :label-width="formLabelWidth"
            style="padding: 10px"
          >
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="菜单分配" :label-width="formLabelWidth">
            <el-tree
              ref="tree"
              :default-checked-keys="menuIds"
              :data="nodeTrees"
              show-checkbox
              :default-expand-all="false"
              node-key="id"
              highlight-current
              :props="defaultProps"
              @check-change="treeChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="saveRow('form')"
          >确认</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodeTrees: [],
      menuIds: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialog: false,
      title: '新增角色',
      queryInfo: {
        page: 1,
        pageSize: 10,
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
          label: '角色名称：',
          key: 'role_name',
        },
      ],
      form: {
        role_name: '',
        role_value: '',
        role_status: 0,
        remark: '',
        menus: '',
      },
      rules: {
        role_name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
        ],
        role_value: [
          { required: true, message: '角色值不能为空', trigger: 'blur' },
        ],
      },
      tableData: [],
      total: 0,
      loading: false,
      columns: [
        {
          attar: {
            label: '角色名称',
            prop: 'role_name',
          },
        },
        {
          attar: {
            label: '角色值',
            prop: 'role_value',
          },
        },
        {
          slot: 'status',
          attar: {
            label: '状态',
          },
        },
        {
          attar: {
            label: '备注',
            prop: 'remark',
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
      roles: [],
    }
  },
  created() {
    this.init()
    this.getCartoonCategory()
    this.nodeList()
  },
  methods: {
    async init() {
      this.$nextTick(() => {
        const headerH = this.$refs.header.offsetHeight
        this.tableHeight = this.$getTableHeight(headerH)
      })
    },
    async nodeList() {
      const res = await this.$api.getMenus({ isAll: true })
      if (res.code == 200) {
        this.nodeTrees = await this.arrayToTree(res.data.data)
      }
    },
    async arrayToTree(items) {
      const res = [] // 存放结果集
      const map = {}
      // 判断对象是否有某个属性
      const getHasOwnProperty = (obj, property) =>
        Object.prototype.hasOwnProperty.call(obj, property)

      // 边做map存储，边找对应关系
      for (const i of items) {
        map[i.id] = {
          ...i,
          children: getHasOwnProperty(map, i.id) ? map[i.id].children : [],
        }
        const newItem = map[i.id]
        if (i.parent_id === 0) {
          res.push(newItem)
        } else {
          if (!getHasOwnProperty(map, i.parent_id)) {
            map[i.pid] = {
              children: [],
            }
          }
          map[i.parent_id].children.push(newItem)
        }
      }
      return res
    },
    async onChange(id) {
      let { role_status } = this.tableData.find((item) => item.id === id)
      role_status = role_status === 0 ? role_status : 1
      await this.$api.editRole({ role_status, id })
      this.getCartoonCategory()
    },
    async getCartoonCategory() {
      this.loading = true
      try {
        const res = await this.$api.getRoles(this.queryInfo)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.tableData.forEach((item) => {
            if (item.create_time) {
              item.create_time = this.$moment(item.create_time).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }
          })
          this.total = res.data.total
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    treeChange() {
      this.menuIds = this.$refs.tree.getCheckedKeys()
    },
    handleClose() {
      this.dialogFormVisible = false
      this.form = {
        role_name: '',
        role_value: '',
        role_status: true,
        remark: '',
        menus: '',
      }
      this.title = '添加角色'
      // 清除选中状态
      this.$refs.tree.setCheckedKeys([])
    },
    // 单个删除
    delRow(id) {
      this.delRowAll([id])
    },
    // 批量删除
    async delRowAll(ids) {
      const res = await this.$api.delRole({ ids: ids.toString() })
      if (res.code == 200) {
        this.getCartoonCategory()
        return this.$message.success(res.msg)
      }
    },
    editRow(row) {
      this.form = {
        id: row.id,
        role_name: row.role_name,
        role_value: row.role_value,
        role_status: row.role_status,
        remark: row.remark,
        menus: row.menus,
      }
      this.title = '修改菜单'
      this.menuIds = row.menus.split(',')
      this.dialogFormVisible = true
    },
    async saveRow(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.form.menus = this.menuIds.join(',')
          this.form.role_status =
            this.form.role_status === 0 ? this.form.role_status : 1
          let res
          if (this.form.id) {
            res = await this.$api.editRole(this.form)
          } else {
            res = await this.$api.addRole(this.form)
          }
          if (res.code === 200) {
            this.handleClose()
            this.getCartoonCategory()
            return this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
  .demo-drawer {
    position: relative;
    .demo-footer {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
}
</style>
