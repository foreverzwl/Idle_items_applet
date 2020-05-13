<template>
  <div class="tab_box">
    <div class="title">
      <p>{{infoData.title}}</p>
      <div>
        <img v-if="isShow" @click="updateAddress" src="/static/images/address_edit.svg" />
        <img v-else @click='createAddress' src="/static/images/address_create.svg" />
      </div>
    </div>
    <div class="list">
      <ul v-if="isShow">
        <li v-for="(val, key, index) in infoData.listObjData" :key="index">{{val.name}}：{{val.value}}</li>
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
    }
  },
  watch: {
    infoData: {
      handler (newVal, oldVal) {
        this.$nextTick(() => {
          this.isShow = (JSON.stringify(newVal.listObjData) !== '{}') ? 1 : 0
        })
      },
      deep: true,
      immedate: true
    }
  },
  data () {
    return {
      editOn: false,
      createOn: false,
      isShow: 0
    }
  },
  methods: {
    //  创建个人地址信息
    createAddress () {
      console.log('点击了创建')
      let obj = {
        'isCreate': true,
        'addressData': {}
      }
      let objJson = JSON.stringify(obj)
      console.log(objJson)
      wx.navigateTo({
        url: '/pages/address/main?info=' + objJson
      })
    },
    //  更新个人地址信息
    updateAddress () {
      console.log('点击了更新')
      let obj = {
        'isCreate': false,
        'addressData': this.infoData.originData
      }
      let objJson = JSON.stringify(obj)
      console.log(objJson)
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
