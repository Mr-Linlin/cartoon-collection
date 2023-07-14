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
            @click="setCollection"
            :loading="btnLoading"
            >一键映射最新章节</el-button
          >
          <p style="margin-left: 15px">执行日志</p>
          <div class="carry-log">
            <div class="form-item">
              <el-input
                type="textarea"
                v-model="linkLog"
                rows="7"
                disabled
                resize="none"
              ></el-input>
            </div>
          </div>
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
        @selectionChange="selectionChange"
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
                v-lazy="scope.img_url ? scope.img_url : defalut_img"
                height="400px"
              />
            </div>
            <div class="goods-image">
              <img
                v-if="scope.img_url"
                :src="scope.img_url"
                alt=""
                height="50px"
              />
              <img v-else :src="defalut_img" alt="" height="50px" />
            </div>
          </el-tooltip>
        </template>
        <template slot="charge" slot-scope="{ scope }">
          {{ scope.charge == 1 ? '会员' : '免费' }}
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
      title="修改漫画"
      :visible.sync="dialogFormVisible"
      width="800px"
      @close="handleClose"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules">
          <div class="flex-box">
            <div class="flex-item">
              <el-form-item
                label="漫画名称"
                prop="name"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="form.name"
                  placeholder="请输入"
                  size="small"
                />
              </el-form-item>
            </div>
            <div class="flex-item">
              <el-form-item
                label="作者"
                prop="author"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="form.author"
                  placeholder="请输入"
                  size="small"
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex-box">
            <div class="flex-item">
              <el-form-item label="漫画分类" :label-width="formLabelWidth">
                <el-select
                  v-model="form.category_id"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in categorys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="flex-item">
              <el-form-item label="是否收费" :label-width="formLabelWidth">
                <el-select
                  v-model="form.charge"
                  size="small"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in chargeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="封面" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="imgSaveToUrl2"
              :before-upload="beforeAvatarUpload2"
            >
              <img
                v-if="form.img_url"
                :src="form.img_url"
                class="avatar"
                alt=""
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item
            label="简介"
            prop="cartoon_introduction"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.cartoon_introduction"
              type="textarea"
              :rows="3"
              placeholder="请输入"
              size="small"
            />
          </el-form-item>
          <div class="flex-box">
            <div class="flex-item">
              <el-form-item label="阅读量" :label-width="formLabelWidth">
                <el-input
                  v-model="form.read"
                  placeholder="请输入"
                  size="small"
                />
              </el-form-item>
            </div>
            <div class="flex-item">
              <el-form-item label="点赞量" :label-width="formLabelWidth">
                <el-input
                  v-model="form.fabulous"
                  placeholder="请输入"
                  size="small"
                />
              </el-form-item>
            </div>
          </div>
          <div class="chapter">
            <div
              class="chapter-item"
              v-for="item in chapterList"
              :key="item.id"
            >
              {{ item.title }}
            </div>
          </div>
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
import { delay } from '@/util/utils'
export default {
  data() {
    return {
      btnLoading: false,
      formLabelWidth: '120px',
      linkLog: '',
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
          label: '漫画名称：',
          key: 'name',
        },
      ],
      form: {
        name: '',
        cartoon_introduction: '',
        img_url: '',
        read: '',
        fabulous: '',
        charge: '',
        status: '',
        category_id: '',
        author: '',
        cover_lateral: '',
        platform_comic: '',
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        phone: [{ required: true, message: '角色值不能为空', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
      },
      tableData: [],
      total: 0,
      loading: false,
      columns: [
        {
          attar: {
            label: '漫画名称',
            prop: 'name',
          },
        },
        {
          attar: {
            label: '简介',
            prop: 'cartoon_introduction',
            'show-overflow-tooltip': true,
            width: 250,
          },
        },
        {
          slot: 'cover',
          attar: {
            label: '封面',
            width: 60,
          },
        },
        {
          attar: {
            label: '阅读量',
            prop: 'read',
          },
        },
        {
          attar: {
            label: '收藏量',
            prop: 'fabulous',
          },
        },
        {
          slot: 'charge',
          attar: {
            label: '是否收费',
            prop: 'charge',
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
      selectData: [],
      title: '商品材织设置',
      categorys: [],
      chargeArr: [
        {
          label: '免费',
          value: 0,
        },
        {
          label: '收费',
          value: 1,
        },
      ],
      chapterList: [],
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
      const res = await this.$api.getCartoonCategory({ isAll: true })
      if (res.code == 200) {
        this.categorys = res.data.data
      }
    },
    async getCartoonCategory() {
      this.loading = true
      try {
        const res = await this.$api.getCartoonList(this.queryInfo)
        if (res.code == 200) {
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
    async saveRow(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$api.editCartoon(this.form)
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
    async editRow(row) {
      const item = JSON.parse(JSON.stringify(row))
      delete item.create_time
      delete item.update_time
      this.form = {
        ...item,
      }
      this.dialogFormVisible = true
      const query = { comic_id: item.id, isAll: true }
      const res = await this.$api.getChapterList(query)
      if (res.code == 200) {
        this.chapterList = res.data.data
      }
    },
    handleClose() {
      this.dialogFormVisible = false
      this.form = {
        name: '',
        cartoon_introduction: '',
        img_url: '',
        read: '',
        fabulous: '',
        charge: '',
        status: '',
        category_id: '',
        author: '',
        cover_lateral: '',
        platform_comic: '',
      }
      this.chapterList = []
      // 清除选中状态
    },
    async imgSaveToUrl2(option) {
      try {
        const formData = new FormData()
        formData.append('files', option.file)
        const res = await this.$api.uploadFile(formData)
        if (res.code === 200) {
          this.form.img_url = res.data.url
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
      return flag
    },
    async setCollection() {
      if (this.selectData.length == 0) {
        return this.$message.error('请选择数据')
      }
      this.btnLoading = true
      const length = this.selectData.length
      try {
        for (let i = 0; i < this.selectData.length; i++) {
          const item = this.selectData[i]
          this.linkLog =
            `开始采集${item.name}${i + 1}/${length}\n` + this.linkLog
          const param = {
            comicId: item.platform_comic,
            method: 'GET',
            platform: 1,
            detail: 2,
          }
          const res = await this.$api.queryDetailById(param)
          if (res.code == 200) {
            const chapters = res.data
            const total = res.data.length
            for (let index = 0; index < chapters.length; index++) {
              const v = chapters[index]
              const query = {
                comic_id: item.id,
                title: v.title,
                title_alias: v.title_alias,
                cover: v.cover,
                is_vip: v.is_vip,
                platform_chapter: v.chapter_id,
              }
              await delay(1000)
              const res1 = await this.$api.addChapter(query)
              if (res1.code == 200) {
                this.linkLog = `${index + 1}/${total}导入成功\n` + this.linkLog
              } else {
                this.linkLog =
                  `${index + 1}/${total}导入失败,${res1.msg}\n` + this.linkLog
              }
            }
          }
        }
        this.btnLoading = false
        this.linkLog = `导入完成\n` + this.linkLog
      } catch (error) {
        console.log(error)
        this.btnLoading = false
      }
    },
    // 单个删除
    delRow(id) {
      this.delRowAll([id])
    },
    // 批量删除
    async delRowAll(ids) {
      const res = await this.$api.deleteCartoon({ ids: ids.toString() })
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
      this.selectData = val
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
  .carry-log {
    width: 500px;
  }
  .content {
    max-height: 600px;
    overflow-y: auto;
  }
  .flex-box {
    display: flex;
    .flex-item {
      margin-right: 15px;
    }
  }
  .chapter {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .chapter-item {
      margin-right: 15px;
      margin-bottom: 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 25%;
    }
  }
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
