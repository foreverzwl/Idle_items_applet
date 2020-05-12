<template>
  <div class="tab_box">
    <div class="title">
      <p>{{infoData.title}}</p>
      <div>
        <img v-if="editOn" src="/static/images/address_edit.svg" />
        <img v-if="createSwitch" src="/static/images/address_create.svg" />
      </div>
    </div>
    <div class="list">
      <ul v-if="isShow">
        <li v-for="(item,index) in infoData.urlData" :key="index">{{item.name}}</li>
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
    editSwitch: {
      type: Boolean,
      default: false
    },
    createSwitch: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editOn () {
      return this.editSwitch
    },
    createOn () {
      return this.createSwitch
    },
    isShow () {
      return this.infoData.urlData.length > 0 ? 1 : 0
    }
  },
  watch: {
    //  对传入变量进行监控
    editSwitch: {
      handler (n, o) {},
      immedate: true
    },
    createSwitch: {
      handler (n, o) {},
      immedate: true
    },
    infoData: {
      handler (n, o) {},
      deep: true,
      immedate: true
    }
  },
  data () {
    return {
    }
  },
  created () {
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
