<template>
  <div class="tab_box">
    <div class="title" >
      <p>{{infoData.title}}</p>
      <div v-if="iconSwitch">
        <img v-if="isShow" @click="updateAddress" src="/static/images/address_edit.svg" />
        <img v-else @click='createAddress' src="/static/images/address_create.svg" />
      </div>
      <div v-else></div>
    </div>
    <div class="list">
      <ul v-if="isShow">
        <li v-for="(val, key, index) in listObjData" :key="index">{{val.name}}：{{val.value}}</li>
      </ul>
      <div class="no_show" v-else>
        暂无信息
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoData: {
      type: Object
    },
    iconSwitch: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    listObjData () {
      return this.infoData.listObjData
    },
    originData () {
      return this.infoData.originData
    },
    isShow () {
      return JSON.stringify(this.infoData.listObjData) !== '{}'
    }
  },
  watch: {
    infoData: {
      handler (newVal, oldVal) {
      },
      deep: true,
      immediate: true
    },
    iconSwitch: {
      handler (newVal, oldVal) {}
    }
  },
  data () {
    return {
    }
  },
  methods: {
    //  创建个人地址信息
    createAddress () {
      let obj = {
        'isCreate': true,
        'addressData': {}
      }
      let objJson = JSON.stringify(obj)
      wx.navigateTo({
        url: '/pages/address/main?info=' + objJson
      })
    },
    //  更新个人地址信息
    updateAddress () {
      let obj = {
        'isCreate': false,
        'addressData': this.originData
      }
      let objJson = JSON.stringify(obj)
      wx.navigateTo({
        url: '/pages/address/main?info=' + objJson
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
    display: flex
    align-items: center
    border-bottom: 1px solid #f4f4f4
    & p
      flex: 1
    & div img
      width: 48rpx
      height: 48rpx
      margin-left: 20rpx
  .list
    padding: 0 20rpx
    & ul li
      padding: 20rpx 0
      font-size: 28rpx
      color: gray
    .no_show
      padding: 30rpx 0 60rpx 0
</style>
