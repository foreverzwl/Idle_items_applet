<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <div v-if="isLogin"></div>
    <div v-else class="outline">请先登录</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      windowHeight: 0,
      windowWidth: 0
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.getLoginStatus
    }
  },
  methods: {
    initPageStyle () {
      let that = this
      wx.getSystemInfo({
        success (res) {
          that.windowHeight = res.windowHeight
          that.windowWidth = res.windowWidth
        }
      })
    }
  },
  onShow () {
    this.initPageStyle()
    this.$login.isLogin()
  }
}
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
.wrapper
  background-color: #85A5CC
  .outline
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      white-space: nowrap
      color: white
</style>
