<template>
  <div class="channel">
    <div @click="categoryList(item.id)" v-for="(item, index) in dataList" :key="index">
      <img :src="item.url" alt="">
      <p>{{item.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataList: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.$http.get({
        url: '/category/all'
      }).then((res) => {
        this.dataList = res
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>
