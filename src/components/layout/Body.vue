<template>
  <div class="main-container">
    <div class="sidebar">
      <div class="panel-wrap">
        <div class="welcome">
          <h4>欢迎您！{{ userName }}</h4>
        </div>
        <ul class="panel">
          <li :key="item.id" v-for="item in routeItems">
            <router-link class="link" :to="item.link">
              <i :class="item.icon"></i>{{ item.text }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="contents" id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VContent',
  data () {
    return {
      userName: '',
      routeItems: [
        {
          id: 0,
          link: {
            path: '/platform/questionare',
            activeClass: 'is-crt'
          },
          icon: 'icon-file-alt',
          text: '我的问卷'
        },
        {
          id: 1,
          link: {
            path: '/platform/new/',
            activeClass: 'is-crt'
          },
          icon: 'icon-plus-sign',
          text: '新建问卷'
        }
      ]
    }
  },
  created () {
    window.fetch('/getUserName', {
      method: 'get',
      credentials: 'same-origin'
    })
    .then(res => {
      return res.json()
    })
    .then(result => {
      if (result.code === 0) {
        this.userName = result.userName
      }
      if (result.code === -1) {
        this.$router.push({ path: '/login' })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}
</script>
