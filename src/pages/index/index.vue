<template>
  <div class="wrapper">
    <scroll-view class='main' scroll-y='true' @scrolltolower='loadGoods'>
      <search></search>
      <div class="channel" >
        <div @click="changeTab(item.category_id,index)" v-for="(item, index) in categoryList" :key="index">
          <img :src="[currentIndex==index ?item.active_url:item.url]" alt="">
          <p :class="[currentIndex==index ?'active':'']">{{item.name}}</p>
        </div>
      </div>
      <div class="goods_show">
        <div v-if='hasDataList'>
          <waterfall :dataList='dataList'></waterfall>
        </div>
        <div v-else class="no_data">
          <p>当前分类没有商品</p>
        </div>
      </div>
    </scroll-view>
    <div class="fixed_bottom">
        <img @click="creatMyGoods()" src="../../../static/images/create.svg"/>
    </div>
  </div>
</template>
<script>
import search from '@/components/search'
import waterfall from '@/components/waterfall'
export default {
  components: {
    search,
    waterfall
  },
  data () {
    return {
      categoryList: [],
      currentIndex: -1,
      dataList: [],
      hasDataList: true
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.getLoginStatus
    }
  },
  methods: {
    async creatMyGoods () {
      await this.$login.isLogin()
      if (this.isLogin) {
        wx.navigateTo({
          url: '/pages/createGoods/main'
        })
      }
    },
    initCategory () {
      this.$http.get({
        url: '/category/all'
      }).then((res) => {
        this.categoryList = res
      })
    },
    async initGoods () {
      console.log('调用了initGoods')
      this.dataList = await this.$http.get({
        url: '/goods/all'
      }).catch((err) => {
        //  必须捕获promise的异常，不然reject之后不会继续执行
        if (err.statusCode === 404) {
          this.hasDataList = false
        }
        return []
      })
    },
    async changeTab (id, index) {
      wx.showLoading({
        title: '加载中...'
      })
      this.currentIndex = index
      this.dataList = await this.$http.get({
        url: '/goods/by_category?id=' + id
      }).then(res => {
        this.hasDataList = true
        return res
      }).catch((err) => {
        //  必须捕获promise的异常，不然reject之后不会继续执行
        if (err.statusCode === 404) {
          this.hasDataList = false
        }
        return []
      })
    }
  },
  onLoad () {
    this.initCategory()
    this.initGoods()
  },
  //  下拉刷新事件
  onPullDownRefresh () {
    if (this.currentIndex === -1) {
      this.initGoods()
    } else {
      this.changeTab(this.categoryList[this.currentIndex].category_id, this.currentIndex)
    }
    wx.stopPullDownRefresh()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.main
  .channel
    display: flex
    padding: 20rpx 0
    background: #ffffff
    justify-content: space-between
    div
      width: 25%
      display: inline-block
      text-align: center
      transition: all ease 0.8s
      img 
        height: 58rpx
        width: 58rpx
        display: inline-block
      .active
        color: #152737!important
      p
        font-size: 14px
        color: #799AA5
  .goods_show
    height: 100%
    .no_data
      text-align: center
      padding: 20rpx
.fixed_bottom
  position: fixed
  bottom: 0
  right: 0
  padding: 20rpx
  img
    width: 128rpx
    height: 128rpx

</style>
