<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <div v-if="isNoOrders" class="tips">{{tips}}</div>
    <div>
      <orderCard :orderList='orderList' @cancelOrder='cancelOrder' @agreeOrder='agreeOrder' @refuseOrder='refuseOrder' :isStore='isStore' ></orderCard>
    </div>
    
  </div>
</template>

<script>
import orderCard from '@/components/orderCard'
export default {
  data () {
    return {
      windowHeight: 0,
      windowWidth: 0,
      pageType: 'all',
      pageTypeMap: {
        'all': {'name': '全部订单', 'url': '/order/all', 'isStore': false},
        'wait': {'name': '等待商家同意的订单', 'url': '/order/waiting', 'isStore': false},
        'pending': {'name': '等待处理的订单', 'url': '/order/pending_orders', 'isStore': true},
        'trading': {'name': '进入交易状态的订单', 'url': '/order/trading', 'isStore': false},
        'my_trading': {'name': '进入交易状态的订单', 'url': '/order/my_trading', 'isStore': true}
      },
      orderList: [],
      isNoOrders: false,
      tips: '当前没有订单',
      isStore: false
    }
  },
  components: {
    orderCard
  },
  methods: {
    //  用户取消订单操作
    cancelOrder (id) {
      this.$http.post({
        url: '/order/cancel_order/' + id
      }).then(res => {
        //  重新获取订单
        this.initOrderData()
      }).catch((err) => {
        let title = ''
        if (err.statusCode === 500) {
          title = '取消订单失败，服务器异常'
        } else if (err.statusCode === 404 || err.statusCode === 403) {
          title = err.data.msg
        }
        wx.showToast({
          title: title,
          icon: 'none'
        })
      })
    },
    //  商家同意订单操作
    agreeOrder (id) {
      this.$http.post({
        url: '/order/agree_order/' + id
      }).then(res => {
        //  重新获取订单
        this.initOrderData()
      }).catch((err) => {
        let title = ''
        if (err.statusCode === 500) {
          title = '同意订单失败，服务器异常'
        } else if (err.statusCode === 404 || err.statusCode === 403) {
          title = err.data.msg
        }
        wx.showToast({
          title: title,
          icon: 'none'
        })
      })
    },
    //  商家拒绝订单操作
    refuseOrder (id) {
      this.$http.post({
        url: '/order/refuse_order/' + id
      }).then(res => {
        //  重新获取订单
        this.initOrderData()
      }).catch((err) => {
        let title = ''
        if (err.statusCode === 500) {
          title = '拒绝订单失败，服务器异常'
        } else if (err.statusCode === 404 || err.statusCode === 403) {
          title = err.data.msg
        }
        wx.showToast({
          title: title,
          icon: 'none'
        })
      })
    },
    //  获取页面宽高
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
    initNavigationBarTitle () {
      let type = this.$root.$mp.query.type
      let title = this.pageTypeMap[type].name
      this.pageType = type
      wx.setNavigationBarTitle({
        title: title
      })
    },
    //  获取订单数据
    initOrderData () {
      let type = this.pageType
      let url = this.pageTypeMap[type].url
      let isStore = this.pageTypeMap[type].isStore
      this.$http.get({
        url: url
      }).then(res => {
        this.$nextTick(() => {
          this.isNoOrders = false
          this.isStore = isStore
          this.orderList = res
        })
      }).catch(err => {
        console.log(err)
        if (err.statusCode === 404) {
          this.$nextTick(() => {
            this.orderList = []
            this.isNoOrders = true
            this.tips = err.data.msg
            console.log(this.tips)
          })
        }
      })
    }
  },
  //  退出当前页面时清除数据
  onUnload () {
  },
  onShow () {
    this.initNavigationBarTitle()
    this.initOrderData()
  },
  onLoad () {
    this.initPageStyle()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  background-color: #85A5CC
  .tips
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
    white-space: nowrap
    color: white
</style>
