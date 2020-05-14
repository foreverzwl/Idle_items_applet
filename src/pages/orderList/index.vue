<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <orderCard :orderList='orderList' @cancelOrder='cancelOrder'></orderCard>
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
      orderList: []
    }
  },
  components: {
    orderCard
  },
  methods: {
    cancelOrder (id) {
      this.$http.post({
        url: '/order/cancel/' + id
      }).then(res => {
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
    initPageStyle () {
      let that = this
      wx.getSystemInfo({
        success (res) {
          that.windowHeight = res.windowHeight
          that.windowWidth = res.windowWidth
        }
      })
    },
    initNavigationBarTitle () {
      let type = this.$root.$mp.query.type
      let title = ''
      this.pageType = type
      if (type === 'wait') {
        title = '等待商家同意的订单'
      } else if (type === 'all') {
        title = '全部订单'
      }
      wx.setNavigationBarTitle({
        title: title
      })
    },
    //  获取订单数据
    initOrderData () {
      let url = ''
      if (this.pageType === 'all') {
        url = '/order/all'
      } else {
        url = '/order/all'
      }
      this.$http.get({
        url: url
      }).then(res => {
        this.$nextTick(() => {
          this.orderList = res
        })
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
</style>
