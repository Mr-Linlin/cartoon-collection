<template>
  <div class="nav">
    <el-menu class="nav-content" :collapse="isCollapse" router unique-opened :default-active="activeRouter"
      @select="handleSelect">
      <template v-for="item in menuList">
        <el-submenu v-if="item.children && item.children.length" :key="item.name" :index="item.path">
          <template slot="title">
            <i :class="item.svg" class="lin icon" />
            <span slot="title">{{ item.name }}</span>
          </template>
          <template v-for="son in item.children">
            <el-menu-item :key="son.path" :index="son.path" @click.stop.native="storageRouter(son)">{{ son.name
            }}</el-menu-item>
          </template>
        </el-submenu>
        <template v-else>
          <el-menu-item :key="item.path" :index="item.path" @click.stop.native="storageRouter(item)">
            <i :class="item.svg" class="lin icon" />
            <span slot="title">
              <template>
                {{ item.name }}
              </template>
            </span></el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mainVintedConfig } from '@/services/config/main-vinted-config'

export default {
  props: {
    isCollapse: {
      // 是否折叠
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeRouter: '/',
      menuList: [],
      iconType: {
        首页: 'el-icon-s-home',
        配置管理: 'el-icon-setting',
        权限管理: 'el-icon-s-platform',
        个人中心: 'el-icon-user',
        店铺授权: 'el-icon-key',
        订单管理: 'el-icon-s-order',
        包裹管理: 'el-icon-box',
        产品管理: 'el-icon-goods',
        预报管理: 'el-icon-lightning',
        库存管理: 'el-icon-house',
        公共服务: 'el-icon-connection',
        业务扩展: 'el-icon-s-home',
        用户管理: 'el-icon-user',
      },
    }
  },
  watch: {
    $route: {
      handler(newD, oldD) {
        if (newD?.meta?.is_new === 0) {
          const url =
            process.env.NODE_ENV === 'development'
              ? `${process.env.VUE_APP_BASE_API}`
              : mainVintedConfig.baseURL
          this.activeRouter = `${url}${newD.path}`
          console.log(this.activeRouter)

          location.replace(this.activeRouter)
        } else {
          this.activeRouter = newD.path
        }
      },
    },
    deep: true,
  },
  mounted() {
    this.activeRouter = this.$route.path
    this.getRightList()
  },
  methods: {
    handleSelect(key, keyPath) { },
    async getRightList() {
      this.menuLoading = true
      try {
        // 先取登录之后存储的菜单数据
        let menu = localStorage.getItem('MENUS')
        if (menu) {
          menu = JSON.parse(menu)
        }
        this.menuList = menu
      } catch (error) {
        console.log(error)
        this.$message.error(`${error}`)
      } finally {
        // this.menuLoading = false
      }
    },
    storageRouter(item) {
      this.$store.commit('comm/selectMenu', {
        path: item.path,
        name: item.name,
      })
    },
    treeFilter(routes, menu) {
      // console.log(routes, '开始匹配路由', menu)
      const menus = []
      routes.forEach((item) => {
        // console.log(item.path, 'menu', menu)
        const res = menu.find((v) => v.name.includes(item.name))
        if (res) {
          if (item.children && item.children.length > 0) {
            item.children = this.treeFilter(item.children, res.child)
          }
          menus.push(item)
        }
      })
      return menus
    },
  },
}
</script>

<style lang="less" scoped>
.nav {
  transition: width 0.3s;
  height: 100vh;

  .icon {
    margin-right: 8px;
  }

  .head-login {
    width: 150px;

    .head-content {
      text-align: center;
      // padding: 0 16px;
      cursor: pointer;
      font-size: 36px;
      color: #fff;
      // background-color: @mainClick;
      height: @topHeight;
      // border-right: 1px solid @borderColor;
      display: flex;
      align-items: center;
      justify-content: space-between;

      img {
        height: 39px;
      }
    }
  }

  .nav-content {
    height: calc(100% - 70px);
    overflow-y: auto;
    color: #555;
    width: 200px;

    /deep/.el-menu-item {
      min-width: 10px;
    }

    /deep/.is-active {
      .el-submenu__title {
        color: #001529;
      }
    }

    .mainColor {
      color: #001529;
    }
  }

  .custom-box {
    color: #001529;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: bold;
    position: absolute;
    bottom: 0;

    img {
      width: 80%;
    }
  }
}

/deep/.el-menu {
  border: none;
  width: 150px;
}

.dialog-notice {
  z-index: 99999;

  /deep/.el-dialog__body {
    padding: 10px 30px 40px 30px;
  }

  p {
    line-height: 2;
    word-spacing: 8px;
    font-size: 16px;
  }

  .frist-line {
    text-indent: 24px;
  }
}
</style>
