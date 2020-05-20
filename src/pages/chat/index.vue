<template>
  <div class="wrapper"  :style="{MinHeight: windowHeight+'px', width: windowWidth+'px'}">
    <scroll-view scroll-y class="chat_content">
      <ul>
        <li class="tidings_base" :class="[item.isSelf?'myself':'other']" v-for="(item, index) in list" :key="index">
          <div class="user_img">
            <img src="/static/images/chat-user.png" />
          </div>
          <div class="text">
            <span>{{item.text}}</span>
          </div>
        </li>
      </ul>
    </scroll-view>
    <div class="send_box">
      <textarea v-model="say" fixed="true" contenteditable="true" auto-height="true"></textarea>
      <span class="send_btn" @click="sendSocketMessage">发送</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      windowHeight: 0,
      windowWidth: 0,
      say: '',
      goodsId: 0,
      list: [],
      socketOpen: false,
      clientId: '',
      otherId: '',
      isBind: false,
      storeName: '',
      buyerName: ''
    }
  },
  methods: {
    startChat () {
      //  启动wwebSocket
      wx.connectSocket({
        url: 'ws://www.zwl.com:8282'
      })
      //  监听链接成功
      wx.onSocketOpen(res => {
        console.log('调用了onSocketOpen')
        this.socketOpen = true
        // this.list.push('链接成功')
        console.log('准备发送消息')
        // console.log(this.list)
      })
      //  监听接受到服务器的消息
      wx.onSocketMessage(res => {
        console.log('onSocketMessage')
        console.log('返回消息：')
        console.log(res)
        let data = JSON.parse(res.data)
        if (data.type === 'init') {
          this.clientId = data.client_id
          //  绑定用户
          this.$http.post({
            url: '/chat/init',
            data: {'client_id': this.clientId}
          }).then(info => {
            this.isBind = true
            info.data.forEach(item => {
              let obj = {
                'isSelf': item.is_self,
                'text': item.content,
                'create_time': item.create_time
              }
              this.list.unshift(obj)
            })
            console.log('绑定成功')
            console.log(info)
          })
        } else if (data.type === 'tidings') {
          let item = {
            'isSelf': false,
            'text': data.message,
            'create_time': ''
          }
          console.log('接收到的')
          console.log(data)
          this.list.push(item)
          this.fromClientId = data.client_id
        }
      })
      //  监听链接关闭事件
      wx.onSocketClose(res => {
        this.socketOpen = false
        console.log('调用了onSocketClose')
      })
    },
    //  发送聊天消息
    sendSocketMessage () {
      console.log('调用了发送消息方法')
      console.log(this.otherId)
      let item = {
        'isSelf': true,
        'text': this.say,
        'create_time': ''
      }
      this.list.push(item)
      this.$http.post({
        url: '/chat/send_to_store',
        data: {'message': this.say, 'client_id': this.clientId, 'receiver_uid': this.otherId}
      }).then(res => {
        console.log(this.list)
        console.log('post请求')
        console.log(res)
      })
    },
    //  使页面滚动到容器最底部
    pageScrollToBottom () {
      wx.createSelectorQuery().select('.chat_content').boundingClientRect(rect => {
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec()
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
    //  动态设置导航标题
    async initNavigationBarTitle () {
      let goodsId = this.$root.$mp.query.id
      this.goodsId = goodsId
      this.storeName = await this.$http.get({
        url: '/goods/owner/' + goodsId
      }).then(res => {
        this.otherId = res['storeId']
        this.buyerName = res['buyerName']
        return res['storeName']
      }).catch(() => {
        return ''
      })
      wx.setNavigationBarTitle({
        title: this.storeName
      })
    },
    getPageParams () {
      console.log('initDara')
      let goodsId = this.$root.$mp.query.id
      let info = this.$root.$mp.query.info
      if (goodsId) {
        this.goodsId = goodsId
        this.initNavigationBarTitle()
      }
      if (info) {
        info = JSON.parse(info)
        console.log('初始阿虎')
        console.log(info)
        this.otherId = info['other']
        wx.setNavigationBarTitle({
          title: info['name']
        })
      }
      console.log('this.otherId')
    }
  },
  onUnload () {
    this.list = []
    this.say = ''
    this.socketOpen = false
    this.clientId = ''
    this.otherId = ''
    this.isBind = false
    this.storeName = ''
    this.buyerName = ''
  },
  onShow () {
    this.initPageStyle()
    this.getPageParams()
    this.startChat()
    this.pageScrollToBottom()
  }
}
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
.wrapper
  box-sizing: border-box
  padding: 20rpx
  padding-bottom: 100rpx
  background: #EDEDED
  .send_box
    width: 100%
    padding: 20rpx
    border-top: 1rpx solid #f4f4f4
    borderbox-shadow: 0 0 5px silver
    background: #F6F6F6
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    position: fixed
    bottom: 0
    left: 0
    & textarea 
      flex: 1
      background: white
      padding: 10rpx
      max-height: 58px!important
    .send_btn
      background: #85A5CC
      border-radius: 8rpx
      color: white
      margin-left: 20rpx
      padding: 10rpx 20rpx
  .chat_content
    min-height: 100%
    .tidings_base
      display: flex
      padding: 10rpx 0
      align-items: center
      .user_img
        width: 84rpx
        height: 84rpx
        background: white
        border-radius: 8rpx
        & img
          width: 100%
          height: 100%
      .text
        flex:  1
        padding: 20rpx
        border-radius: 8rpx
        margin: 20rpx 0 20rpx 20rpx
        position: relative
        
    .other
      .text
        margin-right: 20rpx
        background: white
        color: black
        & span::before
          content: ''
          right: 100%
          top: 25%
          border: 16rpx solid #ffffff00
          border-right: 16rpx solid white
          position: absolute
    .myself
      justify-content: flex-end
      .text
        order: -1
        margin-right: 20rpx
        background: #85A5CC
        color: black
        & span::after
          content: ''
          left: 100%
          top: 25%
          border: 16rpx solid #ffffff00
          border-left: 16rpx solid #85A5CC
          position: absolute
</style>
