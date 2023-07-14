<template>
  <div class="layout">
    <div class="header-wrap">
      <div class="logo">
        <img src="../../assets/images/common/logo.png" alt="" />
      </div>
      <div class="info">
        <div class="login-out">
          <el-popover
            placement="bottom"
            width="50"
            trigger="hover"
            popper-class="user-popover"
          >
            <div style="text-align: center">
              <div style="color: #1e9fff; cursor: pointer" @click="logOut">
                退出登录
              </div>
            </div>
            <div slot="reference" class="user" style="dispaly: flex">
              <p class="name" style="margin-left: 5px; cursor: pointer">
                admin
              </p>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="has-nav">
      <div v-if="!$route.meta.hiddenComm" class="nav-list">
        <NavChild />
      </div>
      <div class="content">
        <!-- 判断是否需要导航栏 -->
        <div v-if="$store.state.comm.tabsList.length > 0" class="content-tag">
          <RouterTag />
        </div>

        <div
          class="content-box"
          :class="{ clearClass: $store.state.comm.tabsList.length == 0 }"
        >
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive" class="view-info" />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" class="view-info" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const NavChild = () => import('@/components/layout/navBar')
const RouterTag = () => import('@/components/layout/routerTag')
export default {
  name: 'Layout',
  components: {
    NavChild,
    RouterTag,
  },
  data() {
    return {
      isCollapse: false,
      userName: '',
      contact: '',
      dialogTableVisible: false,
      config: '',
    }
  },
  computed: {
    navWidth() {
      if (this.isCollapse) {
        return '64px'
      } else {
        return '150px'
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const user = localStorage.getItem('USERINFO')
      this.userName = this.$store.getters.getUserName(user)
      // console.log(this.$store)
    },
    onProfile() {
      this.$router.push('/new/personal/userinfo')
    },
    openContent() {
      this.dialogTableVisible = true
      console.log(111)
    },
    // 退出登录
    async logOut() {
      // 需要清除的存储
      const localStorageName = ['USERINFO', 'MENUS', 'ACCESS_TOKEN']
      sessionStorage.removeItem('routerTag')
      localStorageName.forEach((item) => {
        localStorage.removeItem(item)
      })
      this.$notify({
        title: '成功',
        message: '退出登录成功',
        type: 'success',
      })
      location.reload()
    },

    changeCollapse(val) {
      this.isCollapse = val
    },
  },
}
</script>

<style lang="less">
// @import '~@/assets/css/element-ui-ex.less';
.layout {
  color: @textColor;

  .header-wrap {
    position: fixed;
    display: flex;
    justify-content: space-between;
    top: 0;
    width: 100%;
    height: 64px;
    line-height: 64px;
    z-index: 4;
    background: #2b303b;
    color: #fff;

    .logo {
      padding: 0 24px;

      img {
        height: 50px;
        width: 108px;
        margin: 7px 0;
      }
    }

    .info {
      padding: 0 34px;
      display: flex;

      .nav_bar {
        display: flex;

        li {
          width: 100px;
          text-align: center;
          cursor: pointer;

          .text-info {
            display: inline-block;
            width: 56px;
            height: 30px;
            line-height: 30px;
            background-color: #2b303b;
            color: #b7b7b7;
            border: 1px solid #777;
            padding: 0 6px;
            text-align: center;
            border-radius: 2px;
          }
        }

        .active {
          border-bottom: 3px solid rgb(30, 159, 255);
        }
      }

      .login-out {
        .user-popover {
          padding: 0px !important;
        }

        .p-container {
          .text-info {
            color: #0000;
            font-size: 18px;
            font-weight: 500;
          }
        }
      }
    }

    .content-tag {
      height: 32px;
      line-height: 32px;
      background-color: #fff;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
    }
  }
}

.content {
  .text {
    display: flex;
    margin-bottom: 20px;

    .label {
      margin-right: 10px;
    }
  }
}

// 文字超出隐藏
.text-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// 自定义多行文字超出隐藏
.text-line-overflow {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //这里设置行数
  -webkit-box-orient: vertical;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(199, 185, 185);
  border-radius: 10px;
}

// 全局表格样式
.el-table {
  .el-table__header-wrapper {
    .el-table__header th {
      background: #f7f8fa;
      font-size: 14px;
      height: 48px !important;
      padding: 0 !important;
      box-sizing: border-box;
      color: #86909c;
      border-bottom: none !important;
    }
  }

  .el-table__fixed-header-wrapper {
    .el-table__header th {
      background: #f7f8fa !important;
      font-size: 14px !important;
      height: 48px !important;
      padding: 0 !important;
      box-sizing: border-box;
      color: #86909c;
      border-bottom: none !important;
    }
  }

  th {
    background: #f7f8fa !important;
    font-size: 14px !important;
    box-sizing: border-box;
    color: #86909c;
  }
}

// 弹窗蒙层
.v-modal {
  z-index: 998 !important;
}

// 绝对定位水平垂直居中
.position-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

//去除input为number时的上下键
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.success-text {
  color: #6b6dee !important;
}

.link-text {
  color: @mainColor !important;
  text-decoration: underline !important;
  cursor: pointer;
}

.mainColor {
  color: @mainColor !important;
}

.link {
  text-decoration: underline !important;
  cursor: pointer;
}

.showLogBox {
  position: fixed;
  bottom: 5px !important;
  right: 0px;
  width: 380px;
  height: 325px !important;
  z-index: 100000;
  transition: all 0.3s;

  &.showBox {
    transform: translateX(380px) !important;
  }

  .consoleBox {
    width: 360px;
    height: 300px !important;
    background: #ffffff;
    border: 1px solid #eeeeee;
    padding: 10px;
    overflow-y: auto;
    display: inline-block;
    position: absolute;
  }

  .closeBox {
    width: 20px;
    background: #ffffff;
    display: inline-block;
    vertical-align: top;
    line-height: 40px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border: 1px solid #eeeeee;
    background-color: #f6f7fa;
    border-right: none;
    cursor: pointer;
    padding-left: 1px;
    position: absolute;
    top: 0px;
    left: -20px;
  }

  i {
    font-size: 18px;
    color: #909399;
  }
}

.auth-box {
  background: #fff !important;
  width: 420px;
  vertical-align: middle;
  border: 1px solid #ebeef5;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  text-align: left;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  > p {
    color: #000 !important;
    line-height: 2;
  }
}

.el-icon-link {
  font-size: 18px;
  color: @mainColor;
}

.copyIcon {
  color: @mainColor;
  cursor: pointer;
}
</style>
<style lang="less" scoped>
.content-info {
  min-height: 100vh;
  background-color: @bgColor;
}

.has-nav {
  display: flex;

  .nav-list {
    // width: @navWidth;
    height: 100vh;
    position: fixed;
    top: 72px;
    left: 15px;
    z-index: 10;
    transition: width 0.3s;
  }

  .content {
    background-color: @bgColor;
    min-height: 100vh;
    // transition: width 0.3s;
    width: 100%;
    .content-tag {
      position: fixed;
      z-index: 10;
      height: 39px;
      // padding-top: 8px;
      // line-height: 40px;
      background-color: rgb(247, 248, 253);
      // border-bottom: 1px solid #d9d9d9;
      left: 230px;
      top: 64px;
      right: 0;
      display: flex;
    }

    .content-box {
      min-height: calc(100vh - 104px);
      margin-left: 200px;
      margin-top: 104px;

      .view-info {
        padding: 0 16px;
      }
    }
    .clearClass {
      margin-top: 74px !important;
    }
  }
}
</style>
