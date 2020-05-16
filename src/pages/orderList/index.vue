<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <div v-if="isNoOrders" class="tips">{{tips}}</div>
    <div>
      <orderCard :orderList='orderList' 
                 :isStore='isStore'
                 @cancelOrder='cancelOrder' 
                 @agreeOrder='agreeOrder' 
                 @refuseOrder='refuseOrder' 
                 @cancelTrade='cancelTrade'
                 @confirmOrder='confirmOrder' ></orderCard>
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
        'trading': {'name': '进入交易状态的订单', 'url': '/order/trading', 'isStore': false},
        'successful_orders': {'name': '交易成功的订单', 'url': '/order/successful_orders', 'isStore': false},
        'pending': {'name': '等待处理的订单', 'url': '/order/pending_orders', 'isStore': true},
        'my_trading': {'name': '进入交易状态的订单', 'url': '/order/my_trading', 'isStore': true},
        'my_all_sales': {'name': '全部出售订单', 'url': '/order/my_all_sales', 'isStore': true}
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
    //  用户确认交易完成操作
    confirmOrder (id) {
      this.operateOrder('/order/confirm_trade/' + id, '确认完成交易失败，服务器异常')
    },
    //  用户取消交易操作
    cancelTrade (id) {
      this.operateOrder('/order/cancel_trade/' + id, '取消交易失败，服务器异常')
    },
    //  用户取消订单操作
    cancelOrder (id) {
      this.operateOrder('/order/cancel_order/' + id, '取消订单失败，服务器异常')
    },
    //  商家同意订单操作
    agreeOrder (id) {
      this.operateOrder('/order/agree_order/' + id, '同意订单失败，服务器异常')
    },
    //  商家拒绝订单操作
    refuseOrder (id) {
      this.operateOrder('/order/refuse_order/' + id, '拒绝订单失败，服务器异常')
    },
    //  操作订单
    operateOrder (url, titleMessage) {
      this.$http.post({
        url: url
      }).then(res => {
        //  重新获取订单
        this.initOrderData()
      }).catch((err) => {
        let title = ''
        if (err.statusCode === 500) {
          title = titleMessage
        } else if (err.statusCode === 404 || err.statusCode === 403 || err.statusCode === 406) {
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
