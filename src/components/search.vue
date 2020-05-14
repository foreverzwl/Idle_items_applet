<template>
  <div class="search">
    <div class="head">
      <div>
        <img src="/static/images/search.png" alt="" > 
        <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @confirm="searchWords" placeholder="商品搜索">
        <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
      </div>
      <div @click="cancel">取消</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      words: ''
    }
  },
  methods: {
    clearInput () {
      this.words = ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.search
  height: 100%
  position: relative
  .head
    height: 91rpx
    display: flex
    padding: 0 32rpx
    align-items: center
    justify-content: space-between
    background: #fff
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.15)
    div:nth-child(1)
      height: 59rpx
      display: flex
      flex: 0 1 auto
      align-items: center
      background: #f4f4f4
      img 
        display: inline-block
        width: 31rpx
        height: 31rpx
        padding: 0 20rpx
        flex: 0 1 31rpx
      input
        display: inline-block
        flex: 0 1 auto
        width: 480rpx
        height: 59rpx
        margin-left: 10rpx
      .del
        width: 53rpx
        height: 53rpx
        flex: 0 1 53rpx
        padding: 0
    div:nth-child(2)
        flex: 0 1 130rpx;
        text-align: center;
</style>
