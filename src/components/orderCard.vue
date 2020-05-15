<template>
  <div class="wrapper">
    <div class="order" v-for="(order, index) in dataList" :key="index">
      <div class="order_header">
        <span class="store_name">商家姓名：{{order.store_name}}</span>
        <span class="order_status">{{order.status.name}}</span>
      </div>
      <div class="order_content" v-for="(item, itemIndex) in order.item" :key="itemIndex" >
        <div class="left" >
          <img :src="item.snap_img" :style="{width: size + 'rpx',height: size + 'rpx'}" />
        </div>
        <div class="right">
          <div class="description">
            {{item.snap_description}}
          </div>
          <div class="price">
            <span>￥{{item.snap_price | toFixed(2)}}</span>
            <span class="count">x{{item.count}}</span>
          </div>
        </div>
      </div>
      <div class="order_footer">
        <p class="order_trade">交易方式：{{order.trade.name}}</p>
        <p>
          <span class="order_count">订单商品总数：{{order.total_count}}</span>
          <span>总价：{{order.order_price | toFixed(2)}}</span>
        </p>
        <div v-if="(storeFlag && order.status.code == 0)">
          <span class="operate" @click="agreeOrder(order.order_no)" >同意</span>
          <span class="operate" @click="refuseOrder(order.order_no)" >拒绝</span>
        </div>
        <div v-else>
          <span class="operate" @click="cancelOrder(order.order_no)"  v-if="(order.status.code == 2)">完成</span>
          <span class="operate" @click="cancelOrder(order.order_no)"  v-if="(order.status.code == 0 || order.status.code == 2)">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderList: {
      type: Array
    },
    imgSize: {
      type: String,
      default: 160
    },
    buttonSwitchList: {
      type: Array,
      default: {'agree': false}
    },
    isStore: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    dataList () {
      return this.orderList
    },
    size () {
      return this.imgSize
    },
    agreeButtonFlag () {
      console.log('this.buttonSwitchList.agree')
      console.log(this.buttonSwitchList.agree)
      return this.buttonSwitchList.agree || false
    },
    refuseButtonFlag () {
      console.log('this.buttonSwitchList.refuse')
      console.log(this.buttonSwitchList.refuse)
      return this.buttonSwitchList.refuse || false
    },
    cancelButtonFlag () {
      console.log('this.buttonSwitchList.cancel')
      console.log(this.buttonSwitchList.cancel)
      return this.buttonSwitchList.cancel || false
    },
    completeButtonFlag () {
      console.log('this.buttonSwitchList.complete')
      console.log(this.buttonSwitchList.complete)
      return this.buttonSwitchList.complete || false
    },
    storeFlag () {
      return this.isStore
    }
  },
  watch: {
    orderList: {
      handler (newVal, oldVal) {
      },
      deep: true,
      immediate: true
    },
    buttonSwitchList: {
      handler (newVal, oldVal) {
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    cancelOrder (id) {
      this.$emit('cancelOrder', id)
    },
    agreeOrder (id) {
      this.$emit('agreeOrder', id)
    },
    refuseOrder (id) {
      this.$emit('refuseOrder', id)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  padding: 0 20rpx
  box-sizing: border-box
  overflow: hidden
  .order
    background: white
    border-radius: 8rpx
    padding: 20rpx
    margin: 20rpx 0
    .order_header
      padding-bottom: 20rpx
      display: flex
      justify-content: space-between
      align-items: center
      .store_name
        font-weight: bold
        font-size: 32rpx
      .order_status
        font-size: 28rpx
        color: red
    .order_content
      display:flex
      justify-content: space-between
      .left
        font-size: 0
      .right
        flex: 1
        padding-left: 20rpx
        font-size: 32rpx
        line-height: 150%
        .price
          display: flex
          justify-content: space-between
          align-items: center
        .count
          font-size: 28rpx
          color: gray
    .order_footer
      font-size: 26rpx
      text-align: right
      line-height: 150%
      .order_count,.order_trade
        color: gray
      .order_count
        margin-right: 5%
      .operate
        display: inline-block
        color: red
        padding: 10rpx 40rpx
        border-radius: 50px
        border: 1rpx solid red
        margin-top: 20rpx
        margin-left: 5%
</style>
