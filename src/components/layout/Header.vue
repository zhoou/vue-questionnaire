<template>
  <header class="layout-header">
    <div class="title-wrap">
      <span class="logo"></span>
      <h1 class="title">{{ msg }}</h1>
    </div>
    <div class="home">
      <a
        @click="signout"
        :class="{ disabled: isLoading }"
        class="link">登出</a>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
      msg: '微型问卷调查平台',
      isLoading: false
    }
  },
  methods: {
    signout () {
      this.isLoading = true
      window.fetch('/signout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json()
      })
      .then(result => {
        if (result.code === 0) {
          this.$router.push({ path: '/login' })
        }
      })
    }
  }
}
</script>
