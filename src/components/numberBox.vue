<template>
  <div class="wrapper">
    <div class="number_box">
      <div @click="reduce()">-</div>
      <input v-model.lazy="receiveNum" type="number" @blur="isBigZero" />
      <div @click="add()">+</div>
    </div>
    <span>{{unit}}</span>
  </div>
</template>

<script>
export default {
  props: {
    'unit': {
      type: String,
      default: ''
    },
    'min': {
      type: Number,
      default: 1
    },
    'max': {
      type: Number,
      default: 9
    },
    'num': {
      type: Number,
      default: 9
    }
  },
  data () {
    return {}
  },
  computed: {
    receiveNum: {
      get () {
        return this.num
      },
      set (val) {
        this.$emit('getNumberBoxValue', val)
      }
    }
  },
  watch: {
    num: {
      handler (newVal, oldVal) {}
    }
  },
  methods: {
    //  对输入框的值做校验
    isBigZero (e) {
      if (this.receiveNum < this.min) {
        this.receiveNum = this.min
      } else if (this.receiveNum > this.max) {
        this.receiveNum = this.max
      }
    },
    add () {
      if (this.receiveNum + 1 > this.max) {
        this.receiveNum = this.max
      } else {
        this.receiveNum = this.receiveNum + 1
      }
    },
    reduce () {
      if (this.receiveNum - 1 < this.min) {
        this.receiveNum = this.min
      } else {
        this.receiveNum = this.receiveNum - 1
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  display: flex
  align-items: center
  padding: 40rpx 0 20rpx 0
  font-size: 34rpx
  &>span 
    margin-left: 20rpx
    white-space: nowrap
  .number_box
    display: flex
    text-align: center
    align-items: center
    border: 1rpx solid #85A5CC
    &>div
      padding: 0 30rpx
    &>input
      padding: 10rpx 0
      border-left: 1rpx solid #85A5CC
      border-right: 1rpx solid #85A5CC
</style>
