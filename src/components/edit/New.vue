<template lang="html">
  <div class="new-wrap">
    <div class="new">
      <i class="icon-file-alt icon-4x"></i>
      <h3 class="title">创建一个新的调查问卷</h3>
      <p @click.stop="setMode"><router-link to='/platform/new/edit' class="btn">新建</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    setMode () {
      window.sessionStorage.setItem('edit-mode', 'create')
    }
  }
}
</script>
