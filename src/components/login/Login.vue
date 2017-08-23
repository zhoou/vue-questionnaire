<template>
    <div class="login-container">
      <div class="login-bg">
        <div class="login-box clear">
          <div class="aside fl">
            <i class="icon-file-alt icon-3x"></i>
            <h3 class="title">问卷平台</h3>
          </div>
          <div class="content fl">
            <div class="form-wrap">
              <div class="type">
                <span :class="{active:isLoginModel}" @click.stop="changeMode('login')">登录</span>/<span :class="{active:!isLoginModel}" @click.stop="changeMode('register')">注册</span>
              </div>
              <template v-if="isLoginModel">
                <div class="input-item">
                  <input type="email" placeholder="邮箱" v-model="emails">
                  <i class="icon-envelope-alt"></i>
                </div>
                <div class="input-item">
                  <input v-if="!isShowPwd" type="password" placeholder="密码" v-model="password">
                  <input v-else type="text" placeholder="密码" v-model="password">
                  <i :class="[isShowPwd ? 'icon-eye-close':'icon-eye-open']" @click.stop="showPassword"></i>
                </div>
                <div>
                    <button :class="['btn', isLoading ? 'disabled':'']" @click.stop="btnLogin">登录</button>
                </div>
              </template>
              <template v-else>
                <div class="input-item">
                  <input type="text" placeholder="昵称" v-model="userName">
                  <i class="icon-user"></i>
                </div>
                <div class="input-item">
                  <input type="email" placeholder="登录邮箱" v-model="emails">
                  <i class="icon-envelope-alt"></i>
                </div>
                <div class="input-item">
                  <input v-if="!isShowPwd" type="password" placeholder="密码" v-model="password">
                  <input v-else type="text" placeholder="密码" v-model="password">
                  <i :class="[isShowPwd ? 'icon-eye-close':'icon-eye-open']" @click.stop="showPassword"></i>
                </div>
                <div class="input-item">
                  <input v-if="!isShowPwd" type="password" placeholder="确认密码" v-model="rePassword">
                  <input v-else type="text" placeholder="确认密码" v-model="rePassword">
                  <i :class="[isShowPwd ? 'icon-eye-close':'icon-eye-open']" @click.stop="showPassword"></i>
                </div>
                <div>
                    <button :class="['btn', isLoading ? 'disabled':'']" @click.stop="btnSignup">注册</button>
                </div>
              </template>
              <p class="errmsg" v-if='loginTipMsg.length > 0'>{{ loginTipMsg }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'VLOGIN',
  data () {
    return {
      userName: '',
      emails: '',
      password: '',
      rePassword: '',
      inputType: 'password',
      isShowPwd: false,
      isLoginModel: true,
      isLoading: false,
      loginTipMsg: ''
    }
  },
  watch: {
  },
  methods: {
    showPassword () {
      this.isShowPwd = !this.isShowPwd
    },
    changeMode (type) {
      this.isLoginModel = (type === 'login')
    },
    // 登录
    btnLogin () {
      let self = this
      if (!self.isLoading) {
        self.isLoading = true
        // 输入验证
        let isCheck = self.checkEmailAndPwd(self.emails, self.password)
        if (!isCheck) {
          self.isLoading = false
          return
        }
        // 登录验证
        window.fetch('/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            loginEmail: self.emails,
            loginPsd: self.password
          }),
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json()
        })
        .then(function (result) {
          if (result.code === 0) {
            self.$router.push('/platform/questionare')
          }
          if (result.code === -1 || result.code === -2) {
            self.loginTipMsg = result.code === -1 ? '邮箱未注册!' : '密码错误!'
            self.isLoading = false
            self.showLoginTip = true
            window.setTimeout(function () {
              self.showLoginTip = false
            }, 5000)
          }
        })
      }
    },
    // 注册
    btnSignup () {
      let self = this
      if (!self.isLoading) {
        if (self.userName === '') {
          self.loginTipMsg = '昵称不能为空！'
          return
        }
        if (self.emails === '') {
          self.loginTipMsg = '密码不能为空！'
          return
        }
        if (self.password === '') {
          self.loginTipMsg = '密码不能为空！'
          return
        }
        if (self.password !== self.rePassword) {
          self.loginTipMsg = '密码输入不一致，请重新输入！'
          return
        }
        self.isLoading = true
        window.fetch('/signup', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            signupName: self.userName,
            signupEmail: self.emails,
            signupPassword: self.password
          }),
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json()
        })
        .then(function (result) {
          if (result.code === 0) {
            self.$router.push('/platform/questionare')
          }
        })
        .catch((err) => {
          self.isLoading = false
          console.log(err)
        })
      }
    },
    // 输入验证
    checkEmailAndPwd (email, pwd) {
      if (email === '' || pwd === '') {
        this.loginTipMsg = '邮箱及密码不能为空！'
        return false
      } else if (!this.emailValidator(email)) {
        this.loginTipMsg = '请输入正确的邮箱格式！'
        return false
      } else {
        this.loginTipMsg = ''
        return true
      }
    },
    // email验证
    emailValidator (val) {
      let pattern = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/i
      return pattern.test(val)
    }
  }
}
</script>
