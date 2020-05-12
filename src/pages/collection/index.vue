<template>
  <div v-if="hasDataList">
    <waterfall :dataList='collections'></waterfall>
  </div>
  <div v-else class="no_data">
    <p>当前没有收藏的商品</p>
  </div>
</template>

<script>
import waterfall from '../../components/waterfall'
export default {
  data () {
    return {
      collections: [],
      hasDataList: true
    }
  },
  methods: {
    initData () {
      this.$http.get({
        'url': '/collection/my_collections'
      }).then((res) => {
        this.hasDataList = true
        this.$nextTick(() => {
          this.collections = res
        })
      }).catch((err) => {
        if (err.statusCode === 404) {
          this.hasDataList = false
        }
      })
    }
  },
  onLoad () {
    this.initData()
  },
  components: {
    waterfall
  },
  //  下拉刷新事件
  onPullDownRefresh () {
    this.collections = []
    this.initData()
  }
}
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
.no_data
  text-align: center
  padding: 20rpx
</style>
