<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <div v-if="isLogin">
      <ul>
        <li v-for="(item,index) in chatList" :key="index" @click="toChat(item.myself,item.other,item.name)">
          <div class="user_img">
            <img src="/static/images/chat-user.png" />
          </div>
          <div class="content">
            <p class="name">{{item.name}}</p>
            <p class="time">{{item.create_time}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="outline">请先登录</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      windowHeight: 0,
      windowWidth: 0,
      i: 1,
      chatList: []
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.getLoginStatus
    }
  },
  methods: {
    toChat (mySelf, other, name) {
      wx.navigateTo({
        url: '/pages/chat/main?info=' + JSON.stringify({'mySelf': mySelf, 'other': other, 'name': name})
      })
    },
    initPageStyle () {
      let that = this
      wx.getSystemInfo({
        success (res) {
          that.windowHeight = res.windowHeight
          that.windowWidth = res.windowWidth
        }
      })
    },
    getChatList () {
      if (!this.isLogin) {
        return false
      }
      this.$http.get({
        url: '/chatList/' + this.i
      }).then(res => {
        this.$nextTick(() => {
          this.chatList = res
        })
        console.log('获取数据')
        console.log(res)
      })
    }
  },
  onShow () {
    this.initPageStyle()
    this.$login.isLogin()
    this.getChatList()
  }
}
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
.wrapper
  background-color: #85A5CC
  & ul
    padding: 20rpx
  & ul li
    display: flex
    align-items: center
    background: white
    border-radius: 8rpx
    padding: 10rpx
    margin: 15rpx 0
  .user_img
    width: 84rpx
    height: 84rpx
    background: white
    border-radius: 8rpx
    margin-right: 20rpx
    & img
      width: 100%
      height: 100%
  .content
    display: flex
    flex-direction: column
    justify-content: space-around
    .time
      font-size: 28rpx
      color: gray
  .outline
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      white-space: nowrap
      color: white
</style>
