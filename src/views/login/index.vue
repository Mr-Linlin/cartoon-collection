<template>
  <div class="login">
    <div class="left">
      <img
        :src="config.sys_login_image ? config.sys_login_image : getImg"
        alt=""
      />
    </div>
    <div class="login_register">
      <div class="centent">
        <div class="logo">
          <img src="../../assets/images/common/logo.png" alt="" />
          <p>欢迎注册登录</p>
        </div>
        <div v-if="isRegister" class="login_form">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入内容"
            class="m-b-18"
          >
            <i slot="prefix" class="el-input__icon el-icon-user" />
          </el-input>
          <div class="verification m-b-18">
            <el-input
              v-model="loginForm.password"
              show-password
              placeholder="请输入密码"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock" />
            </el-input>
          </div>
          <div class="oper2 m-b-18">
            <el-button
              :loading="loginLoading"
              type="primary"
              style="width: 100%"
              @click="login"
              >登录</el-button
            >
          </div>
        </div>
        <div v-else class="login_form">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入昵称"
            class="m-b-18"
          >
            <i slot="prefix" class="el-input__icon el-icon-user" />
          </el-input>
          <div class="verification m-b-18">
            <el-input
              v-model="registerForm.account"
              show-password
              placeholder="请输入手机号/邮箱"
            >
              <i slot="prefix" class="el-input__icon el-icon-user" />
            </el-input>
          </div>
          <div class="verification m-b-18">
            <el-input
              v-model="registerForm.password"
              show-password
              placeholder="请输入密码"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock" />
            </el-input>
          </div>
          <div class="oper2 m-b-18">
            <el-button type="primary" style="width: 100%" @click="register"
              >立即注册</el-button
            >
          </div>
        </div>
        <div class="type">
          <span v-if="isRegister" @click="isRegister = false">快速注册</span>
          <span v-else @click="isRegister = true">登录</span>
        </div>
      </div>
    </div>
    <monica />
  </div>
</template>

<script>
import monica from './monica.vue'
export default {
  components: { monica },
  data() {
    return {
      config: '',
      loginForm: {
        account: '', // 密码
        password: '',
      },
      registerForm: {
        account: '',
        password: '',
        username: '',
      },
      loginLoading: false,
      isRegister: true,
      typeFlag: true,
      isDisabled: false,
      regRules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    getImg() {
      return require('../../assets/images/common/loading.png')
    },
  },
  watch: {
    typeFlag(newValue, old) {
      console.log(newValue)
      if (!newValue) {
        this.loginForm.password = ''
        this.loginForm.phone_code = ''
        console.log(this.loginForm, 'this.loginForm')
      }
    },
  },
  mounted() {},
  methods: {
    async login() {
      if (!this.loginForm.account) {
        this.$message.error('账号不能为空')
        return
      }
      if (!this.loginForm.password) {
        this.$message.error('请输入密码')
        return
      }
      if (this.loginForm.password.length < 6) {
        this.$message.error('请输入正确的密码，密码的长度不能小于6位数')
        return
      }
      this.loginLoading = true
      try {
        const res = await this.$api.login(this.loginForm)
        if (res.code !== 200) {
          return this.$message.error(res?.msg || '登录失败')
        }
        this.$store.commit('comm/setConfig', res.data)
        this.$router.push('/')
      } catch (error) {
        console.log(error, 'error')
        this.$message.error(error?.data?.msg || '登录异常,请联系管理员')
      } finally {
        this.loginLoading = false
      }
    },
    async register() {
      try {
        const res = await this.$api.register(this.registerForm)
        if (res.code == 200) {
          this.isRegister = true
          return this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg || '注册失败')
        }
      } catch (error) {
        console.log(error, 'error')
        this.$message.error(error.msg || '登录异常,请联系管理员')
        console.log(error)
      }
    },
  },
}
</script>

<style scoped lang="less">
.login {
  position: relative;
  display: flex;

  .left {
    width: 730px;
    flex: 0 0 703px;
    height: 100vh;
    min-height: 800px;

    img {
      height: 100%;
    }
  }

  .login_register {
    flex: 1;
    position: relative;
    min-width: 500px;

    // background: red;
    .centent {
      /* width: 340px; */
      border: 1px solid #e9e9e9;
      border-radius: 5px;
      box-shadow: 0px 2px 10px 0px #0000000d;
      position: absolute;
      top: 200px;
      left: 50%;
      margin-left: -200px;
      padding: 30px;

      .logo {
        text-align: center;

        img {
          max-width: 150px;
        }

        p {
          color: #686868;
          margin: 10px 0 20px;
          font-size: 16px;
        }
      }

      .login_form {
        width: 323px;

        .oper2 {
          width: 100%;
        }

        .code-box {
          display: flex;
          font-size: 14px;
        }

        .code-img {
          flex: 4;
          height: 40px;
          line-height: 40px;
          display: inline-block;
          border-radius: 4px;
          box-sizing: border-box;
          outline: 0;
          margin-left: 10px;
        }

        .el-button {
          width: 100%;
          padding: 12px 9px;
        }
      }

      .type {
        // display: flex;
        text-align: center;

        span {
          cursor: pointer;
          display: inline-block;
          margin-right: 12px;
          padding-right: 12px;
          border-right: 1px solid #0069fb;
          line-height: 12px;
          color: #0069fb;
        }

        span:last-child {
          border-right: 0;
        }
      }

      .m-b-18 {
        margin-bottom: 18px;
      }
    }
  }
}
</style>
