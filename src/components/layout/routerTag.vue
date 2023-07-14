<template>
  <div class="router-tag">
    <div
      v-for="(item, index) in tagList"
      :key="item.path"
      class="tag-item"
      :class="{ active: isActive(item.path) }"
    >
      <span class="title" @click="routerChange(item.path)">{{
        item.name
      }}</span>
      <!-- <el-icon v-if="index !== 0" class="close-icon" @click="closeTag(index)"
          ><Close
        /></el-icon> -->
      <i class="el-icon-close close-icon" @click="closeTag(item, index)" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagList: [],
    }
  },
  watch: {
    // 监听路由标签变化
    '$store.state.comm.tabsList': {
      handler(newD, oldD) {
        this.tagList = JSON.parse(JSON.stringify(newD))
      },
      deep: true,
    },
  },
  created() {
    this.getStorageTags()
  },
  methods: {
    // 切换路由
    routerChange(path) {
      this.$router.push({ path })
    },
    // 激活状态
    isActive(path) {
      return path === this.$route.path
    },
    // 删除标签
    closeTag(tag, index) {
      const length = this.tagList.length
      this.$store.commit('comm/closeTab', tag)
      if (tag.path !== this.$route.path) {
        return
      }
      if (index === 0) {
        return this.$router.push('/new')
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length - 1) {
        this.$router.push({ path: this.tagList[index - 1].path })
      } else {
        console.log(index, this.tagList[index], '541')
        this.getStorageTags()
        this.$router.push({ path: this.tagList[index].path })
      }
    },
    // 获取缓存的标签
    getStorageTags() {
      if (sessionStorage.getItem('routerTag')) {
        const tagArr = JSON.parse(sessionStorage.getItem('routerTag'))
        if (tagArr) {
          this.tagList = JSON.parse(JSON.stringify(tagArr))
          this.$store.state.comm.tabsList = JSON.parse(JSON.stringify(tagArr))
        }
      } else {
        if (!this.$store.state.comm.tabsList) {
          this.$store.commit('comm/selectMenu', { path: '/new', name: '首页' })
        }
        this.tagList = this.$store.state.comm.tabsList
      }
    },
  },
}
</script>

<style scoped lang="less">
.router-tag {
  display: flex;
  // margin: 15px 0;
  align-items: flex-end;
  .tag-item {
    // width: 160px;
    // padding-right:12px;
    height: 30px;
    line-height: 30px;
    position: relative;
    color: #303133;
    background-color: #eee;
    transition: none;
    text-align: center;
    margin-right: 3px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    font-size: 14px;
    border: 1px solid #d9d9d9 !important;
    cursor: pointer;
    .title {
      padding: 0 30px;
    }
    .close-icon {
      position: absolute;
      right: 10px;
      top: 57%;
      transform: translateY(-50%);
    }
  }
  .active {
    background: #fff;
    border-bottom: 0 !important;
    transition: none;
    // border-bottom: 0px;
    color: rgb(64, 158, 255);
  }
}
</style>
