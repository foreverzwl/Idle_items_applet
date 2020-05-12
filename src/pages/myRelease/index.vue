<template>
  <div>
    <div class="manage">
      <ul>
        <li :class="[currentIndex==index ? 'active' : '']" v-for="(item,index) in manageName" :key="index" @click="changeTab(index)">
          {{item.name}}
        </li>
      </ul>
    </div>
    <div v-if="hasDataList">
      <waterfall :dataList='myGoods' :editable='isShowEdit'></waterfall>
    </div>
    <div v-else class="no_data">
      <p>当前没有该类型商品</p>
    </div>
  </div>
</template>

<script>
import waterfall from '../../components/waterfall'
import {myReleaseData} from '../../utils/sysData'
export default {
  data () {
    return {
      manageName: [],
      myGoods: [],
      currentIndex: 0,
      hasDataList: true
    }
  },
  components: {
    waterfall
  },
  computed: {
    isShowEdit () {
      return this.manageName[this.currentIndex].editable
    }
  },
  methods: {
    async initData () {
      this.manageName = myReleaseData.manage
      this.hasDataList = true
      this.myGoods = await this.$http.get({
        'url': this.manageName[this.currentIndex].url
      }).catch((err) => {
        if (err.statusCode === 404) {
          this.hasDataList = false
        }
        return []
      })
    },
    //  切换选项卡
    changeTab (index) {
      if (this.currentIndex !== index) {
        this.currentIndex = index
        wx.showLoading({
          title: '加载中...'
        })
        this.myGoods = []
        this.initData()
      }
    }
  },
  onLoad () {
    this.initData()
  }
}
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
.manage
  background: #85A5CC
  ul
    display: flex
    justify-content: space-around
    align-items: center
    li
      width: 50%;
      padding: 10rpx
      font-size: 32rpx
      color: white
      background: #85A5CC
      text-align: center
      border-top-left-radius: 20rpx
      border-top-right-radius: 20rpx
      transition: all ease 0.8s
    .active
      background: #618ABD
.no_data
  text-align: center
  padding: 20rpx
</style>
