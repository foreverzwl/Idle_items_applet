<template>
  <div class="tab_box">
    <p class="title">{{tabData.title}}</p>
    <ul class="list" v-for="(liList,index) in tabData.urlData" :key="index">
      <li v-for="(item,key) in liList" :key="key" @click="navigateTo(item.nav)">
        <img :src='item.src'/>
        <p>{{item.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['tabData'],
  data () {
    return {
    }
  },
  methods: {
    navigateTo (url) {
      wx.navigateTo({
        url: url
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tab_box
  width: 95%
  box-shadow: 0 0 5px silver
  border-radius: 4px
  background: #ffffff
  margin-bottom: 20rpx
  .title
    padding: 20rpx
    border-bottom: 1px solid #f4f4f4
  .list
    padding: 20rpx
    display: flex
    justify-content: space-between
    align-items: center
    font-size: 28rpx
    color: gray
    text-align: center
    &>li>img
      width: 58rpx
      height: 58rpx
      display: inline-block
</style>
