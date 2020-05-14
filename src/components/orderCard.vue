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
        <!-- <p class="order_count">订单商品总数：{{order.total_count}}</p> -->
        <p>
          <span class="order_count">订单商品总数：{{order.total_count}}</span>
          <span>总价：{{order.order_price | toFixed(2)}}</span>
        </p>
        <span class="operate" @click="cancelOrder(order.order_no)"  v-if="!order.status.code">取消</span>
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
    }
  },
  watch: {
    orderList: {
      handler (newVal, oldVal) {
        console.log(newVal)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    cancelOrder (id) {
      this.$emit('cancelOrder', id)
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
</style>
