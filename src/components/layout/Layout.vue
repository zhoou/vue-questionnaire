<template>
  <div class="layout">
    <layout-header></layout-header>
    <layout-body></layout-body>
  </div>
</template>

<script>
import LayoutHeader from './Header'
import LayoutBody from './Body'

export default {
  components: {
    LayoutHeader,
    LayoutBody
  }
}
</script>
