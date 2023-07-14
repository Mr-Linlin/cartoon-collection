<template>
  <div class="dashboard">
    <!-- <div class="page-header">
      <div class="title-info">
        <el-avatar :size="90" :src="userInfo.avatar" />
        <div class="tietle">
          欢迎{{ userInfo.username }}，请开始你的工作吧！
        </div>
      </div> -->
    <!-- </div>
    <div class="page-content">
      <div class="content">
        <div class="lg-left">
          <div class="item-card">
            <div class="card-head">
              <div class="title">推荐</div>
              <div class="more" @click="init">更多</div>
            </div>
            <div class="card-body">
              <div
                v-for="(item, index) in cartoons"
                :key="index"
                class="card-body-item"
              >
                <div class="cover">
                  <el-image
                    lazy
                    style="width: 100px; height: 100px"
                    :src="item.img_url"
                    fit="cover"
                  />
                </div>
                <div class="cartoon-info">
                  <p><span>漫画名：</span>{{ item.name }}</p>
                  <p><span>更新时间：</span>{{ item.update_time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lg-right">
          <div class="item-card">
            <div class="card-head">
              <div class="title">推荐</div>
              <div class="more">更多</div>
            </div>
            <div class="card-body">
              <div
                v-for="(item, index) in links"
                :key="index"
                class="card-body-item"
              >
                <el-avatar :size="90" :src="item" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <monica />
    <!-- </div> -->
  </div>
</template>
<script>
import monica from '@/views/login/monica.vue'
export default {
  components: {
    monica,
  },
  data() {
    return {
      cartoons: [],
      userInfo: {
        phone: '',
        username: '',
        avatar: '',
      },
      links: [
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
        'http://lzt-cartoon.oss-cn-shenzhen.aliyuncs.com/avatar/2023040917092597620.jpg',
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { username, avatar } = JSON.parse(localStorage.getItem('USERINFO'))
      this.userInfo.avatar = avatar
      this.userInfo.username = username
      const res = await this.$api.getCartoonList({
        page: Math.floor(Math.random() * (20 - 1)) + 1,
        pageSize: 9,
      })
      if (res.code == 200) {
        res.data.data.forEach((item) => {
          item.create_time = item.create_time
            .replace('T', ' ')
            .replace('.000Z', '')
          item.update_time = item.update_time
            .replace('T', ' ')
            .replace('.000Z', '')
        })
        this.cartoons = res.data.data
      }
    },
  },
}
</script>
<style src="./css/index.less" scoped lang="less"></style>
