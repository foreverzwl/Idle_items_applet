<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <div class="tab">
      <infoCard :infoData='buyerInfo' :iconSwitch='iconSwitch' ></infoCard>
      <infoCard :infoData='storeInfo' :iconSwitch='iconSwitch' ></infoCard>
    </div>
  </div>
</template>

<script>
import infoCard from '@/components/infoCard'
export default {
  data () {
    return {
      windowHeight: 0,
      windowWidth: 0,
      iconSwitch: false,
      buyerInfo: {
        title: '我的信息',
        listObjData: {},
        originData: {}
      },
      storeInfo: {
        title: '商家信息',
        listObjData: {},
        originData: {}
      }
    }
  },
  components: {
    infoCard
  },
  methods: {
    initPageStyle () {
      let that = this
      wx.getSystemInfo({
        success (res) {
          that.windowHeight = res.windowHeight
          that.windowWidth = res.windowWidth
        }
      })
    },
    //  初始化用户信息、买家信息
    getPageParams () {
      let order = JSON.parse(this.$root.$mp.query.order)
      let buyerMap = {
        'name': {'name': '姓名', 'value': ''},
        'mobile': {'name': '联系电话', 'value': ''},
        'address': {'name': '现住址', 'value': ''}
      }
      let storeMap = {
        'name': {'name': '姓名', 'value': ''},
        'mobile': {'name': '联系电话', 'value': ''},
        'address': {'name': '现住址', 'value': ''}
      }
      for (let key in buyerMap) {
        buyerMap[key].value = order.buyer_info[key]
        storeMap[key].value = order.store_info[key]
      }
      this.$nextTick(() => {
        this.$set(this.buyerInfo, 'listObjData', buyerMap)
        if (JSON.stringify(order.store_info) === '{}') {
          this.$set(this.storeInfo, 'listObjData', {})
        } else {
          this.$set(this.storeInfo, 'listObjData', storeMap)
        }
      })
    }
  },
  //  退出当前页面时清除数据
  onUnload () {
  },
  onShow () {
    this.getPageParams()
  },
  onLoad () {
    this.initPageStyle()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  background-color: #85A5CC
  .tab
    display: flex
    flex-direction: column
    align-items: center
</style>
