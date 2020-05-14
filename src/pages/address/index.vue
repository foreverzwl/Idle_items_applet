<template>
  <div class="wrapper" :style="{minHeight: windowHeight + 'px'}">
    <div class="address">
      <div>
        <span class="mark"> * </span>
        <label class="title">姓名：</label>
        <div class="input_box">
          <input v-model='userName' type="text" @blur="maxLength" />
          <p class="err_info" v-if="nameVerifyObj.show">{{nameVerifyObj.text}}</p>
        </div>     
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">联系电话：</label>
        <div class="input_box">
          <input v-model='mobile' type="text" @blur="verifyPhone" />
          <p class="err_info" v-if="phoneVerifyObj.show">{{phoneVerifyObj.text}}</p>
        </div>     
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">所在国家：</label>
        <div class="input_box">
          <input v-model='country' type="text" data-name='country' @blur="verifyCountry" />
          <p class="err_info" v-if="countryVerifyObj.show">{{countryVerifyObj.text}}</p>
        </div>
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">所在省份：</label>
        <div class="input_box">
          <input v-model='province' type="text" data-name='province' @blur="verifyProvince" />
          <p class="err_info" v-if="provinceVerifyObj.show">{{provinceVerifyObj.text}}</p>
        </div>
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">所在城市：</label>
        <div class="input_box">
          <input v-model='city' type="text" data-name='city' @blur="verifyCity" />
          <p class="err_info" v-if="cityVerifyObj.show">{{cityVerifyObj.text}}</p>
        </div>
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">所在区：</label>
        <div class="input_box">
          <input v-model='area' type="text" data-name='area' @blur="verifyArea" />
          <p class="err_info" v-if="areaVerifyObj.show">{{areaVerifyObj.text}}</p>
        </div>
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">详细地址：</label>
        <div class="input_box">
          <input v-model='detail' type="text" data-name='detail' @blur="verifyDetail" />
          <p class="err_info" v-if="detailVerifyObj.show">{{detailVerifyObj.text}}</p>
        </div>
      </div>
    </div>
    <div class="submit">
      <button @click="createOrUpdateAddress">{{createFlag?'创建':'更新'}}</button>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      windowWidth: 0,
      windowHeight: 0,
      createFlag: false,
      userName: '',
      mobile: '',
      country: '',
      province: '',
      city: '',
      area: '',
      detail: '',
      nameVerifyObj: {
        show: false,
        text: ''
      },
      phoneVerifyObj: {
        show: false,
        text: ''
      },
      countryVerifyObj: {
        show: false,
        text: '国家不能为空'
      },
      provinceVerifyObj: {
        show: false,
        text: '省份不能为空'
      },
      cityVerifyObj: {
        show: false,
        text: '城市不能为空'
      },
      areaVerifyObj: {
        show: false,
        text: '区域不能为空'
      },
      detailVerifyObj: {
        show: false,
        text: '详细地址不能为空'
      }
    }
  },
  computed: {
    readyFlag () {
      let val = this.nameVerifyObj.show || this.phoneVerifyObj.show || this.countryVerifyObj.show || this.provinceVerifyObj.show || this.cityVerifyObj.show || this.areaVerifyObj.show || this.detailVerifyObj.show
      return !val
    }
  },
  methods: {
    //  创建商品
    createOrUpdateAddress () {
      if (this.readyFlag) {
        let addressData = {
          'name': this.userName,
          'mobile': this.mobile,
          'country': this.country,
          'province': this.province,
          'city': this.city,
          'area': this.area,
          'detail': this.detail
        }
        console.log('可以发送数据了')
        console.log(addressData)
        this.$http.post({
          url: '/address/operate_address',
          data: addressData
        }).then(res => {
          wx.navigateBack({delta: 1})
        }).catch(() => {
          wx.showToast({
            title: '操作异常，请稍后再试',
            icon: 'none'
          })
        })
      } else {
        wx.showToast({
          title: '请按要求填写数据',
          icon: 'none'
        })
      }
    },
    //  对输入框的值做校验
    maxLength (e) {
      let value = e.mp.detail.value + ''
      if (value === '' || value.length > 6) {
        this.userName = ''
        this.$set(this.nameVerifyObj, 'show', true)
        this.$set(this.nameVerifyObj, 'text', '长度在1~6之间')
      } else {
        this.$set(this.nameVerifyObj, 'show', false)
        this.$set(this.nameVerifyObj, 'text', '')
      }
    },
    //  不能为空
    verifyCountry (e) {
      let value = e.mp.detail.value
      if (value === '') {
        this.$set(this.countryVerifyObj, 'show', true)
      } else {
        this.$set(this.countryVerifyObj, 'show', false)
      }
    },
    verifyProvince (e) {
      let value = e.mp.detail.value
      if (value === '') {
        this.$set(this.provinceVerifyObj, 'show', true)
      } else {
        this.$set(this.provinceVerifyObj, 'show', false)
      }
    },
    verifyCity (e) {
      let value = e.mp.detail.value
      if (value === '') {
        this.$set(this.cityVerifyObj, 'show', true)
      } else {
        this.$set(this.cityVerifyObj, 'show', false)
      }
    },
    verifyArea (e) {
      let value = e.mp.detail.value
      if (value === '') {
        this.$set(this.areaVerifyObj, 'show', true)
      } else {
        this.$set(this.areaVerifyObj, 'show', false)
      }
    },
    verifyDetail (e) {
      let value = e.mp.detail.value
      if (value === '') {
        this.$set(this.detailVerifyObj, 'show', true)
      } else {
        this.$set(this.detailVerifyObj, 'show', false)
      }
    },
    //  验证手机号
    verifyPhone (e) {
      let reg = /^1[3456789]\d{9}$/
      console.log(this.mobile.length)
      console.log(reg.test('13250139098'))
      if (this.mobile === '' || this.mobile.length <= 10 || !reg.test(this.mobile)) {
        this.mobile = ''
        this.$set(this.phoneVerifyObj, 'show', true)
        this.$set(this.phoneVerifyObj, 'text', '请输入正确的手机号码')
      } else {
        this.$set(this.phoneVerifyObj, 'show', false)
        this.$set(this.phoneVerifyObj, 'text', '')
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
    getPageParams () {
      console.log('getPageParams')
      let info = this.$root.$mp.query.info
      info = JSON.parse(info)
      let obj = info.addressData
      this.$nextTick(() => {
        this.createFlag = info.isCreate
        this.userName = obj.name
        this.mobile = obj.mobile
        this.country = obj.country
        this.province = obj.province
        this.city = obj.city
        this.area = obj.area
        this.detail = obj.detail
      })
      console.log('info.addressData')
      console.log(obj)
    }
  },
  //  退出当前页面时清除数据
  onUnload () {
    this.createFlag = false
    this.userName = ''
    this.mobile = ''
    this.country = ''
    this.province = ''
    this.city = ''
    this.area = ''
    this.detail = ''
    this.nameVerifyObj = {
      'show': false,
      'text': ''
    }
    this.phoneVerifyObj = {
      'show': false,
      'text': ''
    }
    this.countryVerifyObj = {
      'show': false,
      'text': '国家不能为空'
    }
    this.provinceVerifyObj = {
      'show': false,
      'text': '省份不能为空'
    }
    this.cityVerifyObj = {
      'show': false,
      'text': '城市不能为空'
    }
    this.areaVerifyObj = {
      'show': false,
      'text': '区域不能为空'
    }
    this.detailVerifyObj = {
      'show': false,
      'text': '详细地址不能为空'
    }
  },
  onShow () {
    this.getPageParams()
    this.initPageStyle()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  padding: 20rpx
  display: flex
  flex-direction: column
  box-sizing: border-box
  .address
    flex: 1
    font-size: 34rpx
    &>div
      padding: 20rpx 0
      display: flex
      align-items: baseline
      line-height: 150%
      & input
        width: 100%
        border: 1rpx solid #f4f4f4
        text-align: center
        padding: 10rpx 0
    .input_box
      flex: 1
      align-items: center
    .price
      color: red
    .mark
      color: red;
      margin-right: 10rpx;
    .title
      white-space: nowrap
    .err_info
      color: red
      font-size: 28rpx
  .submit
    width: 100%
    padding: 20rpx 0
    button
      background: #85A5CC
      color: white
</style>
