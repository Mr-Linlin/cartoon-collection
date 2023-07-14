<template>
  <div class="volume">
    <div ref="tabs" class="header-content">
      <l-tabs :data="typeList" @tabStatus="tabStatus" />
    </div>
    <div ref="header" class="header-content header">
      <search-form
        :form="formColumns"
        :query="queryInfo"
        @seachForm="seachForm"
        btn-text="开始采集"
        v-if="platformType == 1"
      >
        <template slot="btnSlot">
          <el-button
            type="danger"
            size="mini"
            @click="setCollection"
            :loading="btnLoading"
            >一键收藏</el-button
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
      <div v-else class="hearder-box">
        <div class="head-item">
          <div class="box-item">
            <span class="label">开始页码：</span>
            <el-input
              v-model="startPage"
              style="width: 80px"
              size="small"
              clearable
            />
            <span class="label" style="margin-left: 10px">总页码：</span>
            <el-input
              v-model="endPage"
              style="width: 80px"
              size="small"
              clearable
            />
          </div>
          <div class="box-item">
            <el-button
              type="primary"
              size="mini"
              @click="onCollection"
              :loading="btnLoading1"
              >开始采集</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="setCollection"
              :loading="btnLoading"
              >一键收藏</el-button
            >
          </div>
        </div>
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
      </div>
    </div>
    <div class="table-wrap">
      <l-table
        :data="tableData"
        :loading="loading"
        :columns="columns"
        :height="tableHeight"
        :total="total"
        :pagination-flag="true"
        :serial-flag="true"
        :select-flag="true"
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
              <img v-lazy="scope.cover" height="400px" />
            </div>
            <div class="goods-image">
              <img :src="scope.cover" alt="" height="50px" />
            </div>
          </el-tooltip>
        </template>
        <template slot="read_count" slot-scope="{ scope }">
          <span v-if="scope.read_count"
            >{{ Number(scope.read_count / 10000000).toFixed(2) }}亿</span
          >
          <span v-else>0</span>
        </template>
        <!-- <template slot="operate" slot-scope="{ scope }">
          <el-button type="danger" size="mini" @click="setCollection(scope)"
            >收藏</el-button
          >
        </template> -->
      </l-table>
    </div>
  </div>
</template>

<script>
import { delay } from '@/util/utils'
import LTabs from '@/components/Tabs'
export default {
  components: {
    LTabs,
  },
  data() {
    return {
      linkLog: '',
      typeList: ['关键字采集', '漫画链接采集'],
      formLabelWidth: '120px',
      dialogFormVisible: false,
      btnLoading: false,
      btnLoading1: false,
      queryInfo: {
        page: 1,
        page_size: 10,
        key: '',
      },
      formColumns: [
        {
          tag: 'el-input',
          attrs: {
            placeholder: '请输入漫画进行采集',
            clearable: true,
            size: 'mini',
          },
          label: '关键字：',
          key: 'key',
        },
      ],
      tableData: [],
      total: 0,
      loading: false,
      columns: [
        {
          attar: {
            label: '漫画名称',
            prop: 'title',
          },
        },
        {
          attar: {
            label: '简介',
            prop: 'feature',
            'show-overflow-tooltip': true,
            width: 250,
          },
        },
        {
          slot: 'cover',
          attar: {
            label: '封面',
            prop: 'cover',
          },
        },
        {
          attar: {
            label: '最新章节',
            prop: 'chapter_title',
          },
        },
        {
          slot: 'read_count',
          attar: {
            label: '人气',
          },
        },
        // {
        //   slot: 'operate',
        //   attar: {
        //     label: '操作',
        //     width: 200,
        //   },
        // },
      ],
      tableHeight: 500,
      selectData: [],
      category_id: 1,
      platformType: 1,
      startPage: 1,
      endPage: 5,
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.$nextTick(() => {
        const headerH =
          this.$refs.header.offsetHeight + this.$refs.tabs.offsetHeight
        this.tableHeight = this.$getTableHeight(headerH)
      })
      const res = await this.$api.getCartoonCategory({ isAll: true })
      if (res.code == 200) {
        this.category_id = res.data.data[0].id
      }
    },
    async searchKey() {
      this.loading = true
      try {
        const res = await this.$api.searchKey(this.queryInfo)
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.loading = false
        } else {
          this.loading = false
          return this.$message.error(res.msg)
        }
      } catch (error) {
        this.loading = false
      }
    },
    // 采集漫画信息
    async onCollection() {
      this.btnLoading1 = true
      this.tableData = []
      this.total = 0
      this.linkLog = ''
      this.linkLog = '采集中...\n' + this.linkLog
      if (!this.endPage) {
        this.endPage = '1'
      } else {
        this.endPage = Number(this.endPage) > 50 ? '50' : this.endPage
      }
      if (!this.startPage) {
        this.startPage = '1'
      } else if (Number(this.startPage) > Number(this.endPage)) {
        this.startPage = this.endPage
      }
      const num = parseInt(this.startPage)
      const page = parseInt(this.endPage) + 1
      for (let i = num; i < page; i++) {
        const param = {
          platform: 2,
          page: i,
        }
        try {
          const res = await this.$api.queryCartoon(param)
          if (res.code == 200) {
            const total = res.data.length
            const comics = res.data
            for (let index = 0; index < comics.length; index++) {
              const element = comics[index]
              const query = {
                comicId: element.comic_id,
                method: 'GET',
                platform: 1,
                detail: 1,
              }
              await delay(500)
              const res1 = await this.$api.queryDetailById(query)
              if (res1.code == 200) {
                this.linkLog =
                  `${res1.data.title} ${index + 1}/${total}采集成功\n` +
                  this.linkLog
                res1.data.feature = res1.data.content
                this.tableData.push(res1.data)
              }
            }

            this.linkLog =
              `正在采集第${i}页漫画,共采集到${res.data.length}条数据\n` +
              this.linkLog
          }
        } catch (error) {
          console.log(error)
          this.btnLoading1 = false
          this.linkLog = `第${i}页采集失败\n` + this.linkLog
        }
      }
      this.linkLog = '采集完成...\n' + this.linkLog
      this.btnLoading1 = false
    },
    tabStatus(val) {
      this.platformType = val + 1
      // this.getUserMallList()
    },
    // 一键收藏
    async setCollection() {
      if (this.selectData.length == 0) {
        return this.$message.error('请选择数据进行收藏')
      }
      this.btnLoading = true
      const length = this.selectData.length
      for (let i = 0; i < this.selectData.length; i++) {
        const item = this.selectData[i]
        try {
          this.linkLog = `开始收藏${i + 1}/${length}\n` + this.linkLog
          this.linkLog = `收藏${item.title}\n` + this.linkLog
          // novel['category_id'] = 1
          const param = {
            name: item.title,
            cartoon_introduction: item.feature,
            img_url: item.cover,
            cover_lateral: item.cover_lateral,
            read: item.read_count,
            author: item.author_title || item.author_id,
            category_id: this.category_id,
            platform_comic: item.comic_id,
          }
          await delay(1000)
          const res1 = await this.$api.addCartoon(param)
          if (res1.code == 200) {
            this.btnLoading = false
            this.linkLog = `${item.title}收藏成功\n` + this.linkLog
          } else {
            this.btnLoading = false
            this.linkLog = `${item.title}收藏失败,${res1.msg}\n` + this.linkLog
          }
        } catch (error) {
          this.btnLoading = false
          this.linkLog = `${i + 1}/${length}采集失败\n` + this.linkLog
        }
      }
      this.linkLog = `$收藏完成\n` + this.linkLog
    },
    handleSizeChange(val) {
      console.log(val, 111)
      this.queryInfo.page_size = val
      this.searchKey()
    },
    handleCurrentChange(val) {
      this.queryInfo.page = val
      this.searchKey()
    },
    selectionChange(val) {
      this.selectData = val
    },
    seachForm(data) {
      this.queryInfo = data
      this.searchKey()
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
  .hearder-box {
    display: flex;
    .head-item {
      margin-right: 15px;
    }
    .box-item {
      margin-bottom: 20px;
    }
  }
}
</style>
