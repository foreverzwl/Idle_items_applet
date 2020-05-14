<template>
  <div class="wrapper" :style="{minHeight: windowHeight+'px', minWidth: windowWidth+'px'}">
    <div v-if="isLogin" class="content">
      <div class="header">
        <div class="user">
          <img :src='userInfo.avatarUrl'/>
          <span>{{userInfo.nickName}}</span>
        </div>
      </div>
      <div class="tab">
        <tabCard :tabData = 'userPageData.firTabCard'></tabCard>
        <tabCard :tabData = 'userPageData.secTabCard'></tabCard>
        <infoCard :infoData = 'infoCard'></infoCard>
      </div>
    </div>
    <div v-else class="outline">请先登录</div>
  </div>
</template>

<script>
import tabCard from '@/components/tabCard'
import infoCard from '@/components/infoCard'
import sysData from '@/utils/sysData'
export default {
  data () {
    return {
      userInfo: {},
      windowHeight: 0,
      windowWidth: 0,
      userPageData: {},
      infoCard: {
        title: '个人信息',
        listObjData: {},
        originData: {}
      }
    }
  },
  components: {
    tabCard,
    infoCard
  },
  computed: {
    isLogin () {
      console.log('计算isLogin')
      return this.$store.getters.getLoginStatus
    }
  },
  methods: {
    async initData () {
      //  等待登录函数调用完毕后再执行下一步
      await this.$login.isLogin()
      if (this.isLogin) {
        this.userInfo = wx.getStorageSync('userInfo')
        this.userPageData = sysData.userPageData
      }
    },
    initPageStyle () {
      let that = this
      wx.getSystemInfo({
        success (res) {
          that.windowHeight = res.windowHeight
          that.windowWidth = res.windowWidth
        }
      })
    },
    initAddressData () {
      if (this.isLogin) {
        this.$http.get({
          url: '/address'
        }).then(res => {
          let resMap = {
            'name': {'name': '姓名', 'value': ''},
            'mobile': {'name': '联系电话', 'value': ''},
            'address': {'name': '现住址', 'value': ''}
          }
          for (let key in resMap) {
            resMap[key].value = res[key]
          }
          this.$nextTick(() => {
            this.$set(this.infoCard, 'listObjData', resMap)
            this.$set(this.infoCard, 'originData', res)
          })
        }).catch((err) => {
          this.$nextTick(() => {
            if (err.statusCode === 404) {
              this.$set(this.infoCard, 'listObjData', {})
            }
          })
        })
      }
    }
  },
  //  每次进入页面都会执行
  onShow () {
    this.initData()
    this.initPageStyle()
    this.initAddressData()
  }
}
</script>
<style scoped lang="stylus"  rel="stylesheet/stylus">
.wrapper
  background-color: #85A5CC
  .content
    width: 100%
    height: 100%
    .header
      width: 100%
      height: 30%
      color: #ffffff
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx 0 40rpx 0
      .user 
        width: 95%
        img 
          width: 116rpx
          height: 116rpx
          vertical-align: middle
          border-radius: 50%
        span
          margin-left: 5%
          vertical-align: middle
    .tab
      display: flex
      flex-direction: column
      align-items: center
  .outline
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    white-space: nowrap
    color: white
</style>

