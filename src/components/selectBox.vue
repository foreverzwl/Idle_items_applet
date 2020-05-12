<template>
  <div class="select_box">
    <picker mode="selector" :value="selectList[index].code" :range="selectList" range-key='name' @change="pickerChange">
      <view class="picker">
        {{selectList[index].name}}
      </view>
    </picker>
  </div>
</template>

<script>
export default {
  props: {
    'selectList': {
      type: Array
    }
  },
  data () {
    return {
      index: 0//  数组下角标
    }
  },
  watch: {
    selectList: {
      handler (n, o) {
        console.log('selectList改变了')
        console.log(n)
      },
      deep: true
    }
  },
  methods: {
    //  改变选项
    pickerChange (e) {
      let value = e.mp.detail.value
      this.index = value
      //  发布事件，暴露事件给父组件使用
      this.$emit('selectedValue', this.selectList[value].code)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.select_box
  width: 100%
  text-align: center
  border: 1rpx solid #f4f4f4
  .picker
    padding: 10rpx 0
</style>
