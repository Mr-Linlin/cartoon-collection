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
            >新增账号</el-button
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
        <template slot="cover" slot-scope="{ scope }">
          <el-tooltip
            effect="light"
            placement="right-end"
            :visible-arrow="false"
            :enterable="false"
            style="margin: 0 auto"
          >
            <div slot="content">
              <img
                v-lazy="scope.avatar ? scope.avatar : defalut_img"
                height="400px"
              />
            </div>
            <div class="goods-image">
              <img
                v-if="scope.avatar"
                :src="scope.avatar"
                alt=""
                height="50px"
              />
              <img v-else :src="defalut_img" alt="" height="50px" />
            </div>
          </el-tooltip>
        </template>
        <template slot="role" slot-scope="{ scope }">
          {{ scope.role_name ? scope.role_name : '普通用户' }}
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
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="handleClose"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item
            label="用户名"
            prop="username"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.username"
              placeholder="请输入"
              size="small"
            />
          </el-form-item>
          <el-form-item
            label="角色"
            prop="role_id"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.role_id" size="small" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.role_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="头像" prop="phone" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="imgSaveToUrl2"
              :before-upload="beforeAvatarUpload2"
            >
              <img
                v-if="form.avatar"
                :src="form.avatar"
                class="avatar"
                alt=""
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
            <el-input v-model="form.phone" placeholder="请输入" size="small" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="form.email" placeholder="请输入" size="small" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="saveRow('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '新增角色',
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        phone: [{ required: true, message: '角色值不能为空', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
      },
      form: {
        email: '',
        phone: '',
        username: '',
        role_id: '',
        avatar: '',
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      defalut_img:
        'https://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2022113011491721984.jpg',
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
          label: '用户名称：',
          key: 'username',
        },
        {
          tag: 'el-input',
          attrs: {
            placeholder: '请输入',
            clearable: true,
            size: 'mini',
          },
          label: '手机号：',
          key: 'phone',
        },
      ],
      tableData: [],
      total: 0,
      loading: false,
      columns: [
        {
          attar: {
            label: '用户名',
            prop: 'username',
          },
        },
        {
          attar: {
            label: '邮箱',
            prop: 'email',
          },
        },
        {
          slot: 'cover',
          attar: {
            label: '头像',
            width: 60,
            align: 'center',
          },
        },
        {
          attar: {
            label: '电话',
            prop: 'phone',
          },
        },
        {
          slot: 'role',
          attar: {
            label: '角色',
            prop: 'role_name',
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
    this.getRoles()
    this.getCartoonCategory()
  },
  methods: {
    async init() {
      this.$nextTick(() => {
        const headerH = this.$refs.header.offsetHeight
        this.tableHeight = this.$getTableHeight(headerH)
      })
    },
    // 获取角色
    async getRoles() {
      const res = await this.$api.getRoles({ isAll: true })
      if (res.code == 200) {
        this.roles = res.data.data
      }
    },
    async getCartoonCategory() {
      this.loading = true
      try {
        const res = await this.$api.getAccounts(this.queryInfo)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.tableData.forEach((item) => {
            const obj = this.roles.find((v) => v.id == item.role_id)
            if (obj) {
              item.role_name = obj.role_name
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
    handleClose() {
      this.dialogFormVisible = false
      this.form = {
        email: '',
        phone: '',
        username: '',
        role_id: '',
        avatar: '',
      }
      this.title = '添加角色'
      // 清除选中状态
    },
    // 单个删除
    delRow(id) {
      this.delRowAll([id])
    },
    // 批量删除
    async delRowAll(ids) {
      const res = await this.$api.delAccount({ ids: ids.toString() })
      if (res.code == 200) {
        this.getCartoonCategory()
        return this.$message.success(res.msg)
      }
    },
    editRow(row) {
      this.form = {
        id: row.id,
        email: row.email,
        phone: row.phone,
        username: row.username,
        role_id: row.role_id,
        avatar: row.avatar,
      }
      this.title = '修改角色'
      this.dialogFormVisible = true
    },
    async saveRow(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res
          if (this.form.id) {
            res = await this.$api.editAccount(this.form)
          } else {
            this.form.password = '123456'
            res = await this.$api.addAccount(this.form)
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
    async imgSaveToUrl2(option) {
      try {
        const formData = new FormData()
        formData.append('files', option.file)
        const res = await this.$api.uploadFile(formData)
        if (res.code === 200) {
          this.form.avatar = res.data.url
        } else {
          this.$message.error(res.message)
        }
        console.log(res)
      } catch (error) {
        console.log(error)
        this.$message.error('上传图片失败！')
      }
    },
    beforeAvatarUpload2(file) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var txt = event.target.result
        var img = document.createElement('img')
        img.src = txt
        img.onload = () => {
          console.log(img.width)
          console.log(img.height)
        }
      }
      reader.readAsDataURL(file)
      const isPNG = file.type === 'image/png'
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const flag = isPNG || isJPG || isJPEG
      console.log(flag, 'isJPG')
      // const isLt2M = file.size / 800 / 800 < 2
      if (!flag) {
        this.$message.error('上传商品图片只能是 PNG、JPG、JPEG 格式!')
      }
      // if (!isLt2M) {
      //   this.$message2.error('上传商品图片大小不能超过 2MB!')
      // }
      // return flag && isLt2M
      return flag
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
  /deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }

  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  /deep/.avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  /deep/.el-upload__input {
    display: none !important;
  }
}
</style>
