<template>
  <div class="swiper" v-if="showFlag">
    <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
      <block v-for="(item, index) in bannerImgs " :key="index">
        <swiper-item class="swiper-item">
          <image :src="item.url" class="slide-image" @click="previewImg" :data-src='item.url' />
        </swiper-item>
      </block>
    </swiper>
    <div class="goods-info">
      <div class="price_stock">
        <span class="price">￥{{goods.price}}</span>
        <span class="stock">库存：{{goods.stock}} 件</span>
      </div>
      <p class="name">{{goods.description}}</p>
    </div>
    <div class="goods-property">
      <h2>商品属性</h2>
      <ul>
        <li v-for="(item,index) in gooodsProperties" :key="index">
          <span class="property-name">{{item.name}}</span>
          <span class="property-value">{{item.value}}</span>
        </li>
      </ul>
    </div>
    <div class="bottom-fixed">
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' :'']">
        </div>
      </div>
      <div @click="chat">私聊</div>
      <div @click="buy">{{upFlag? '确定' : '立即购买'}}</div>
    </div>
    <div class="choose_count" :class="[upFlag ? '':'down']">
      <p>下单数量：</p>
      <div>
        <numberBox @getNumberBoxValue="getNumberBoxValue"  :num="count"></numberBox>
      </div>
      <p class="total">总价：￥{{total}}</p>
    </div>
  </div>
  <div v-else class="no_found">
    当前商品不存在
  </div>
</template>
<script>
import numberBox from '@/components/numberBox'
export default {
  data () {
    return {
      id: 0,
      goods: [],
      bannerImgs: [],
      gooodsProperties: [],
      collectFlag: false,
      showFlag: false,
      count: 1,
      upFlag: false
    }
  },
  components: {
    numberBox
  },
  methods: {
    //  获取购买数量
    getNumberBoxValue (val) {
      this.count = val
    },
    // 收藏商品
    collect () {
      //  已登录则点击收藏图标将对用户收藏表进行操作
      if (this.loginFlag) {
        //  处于未收藏状态则添加收藏关系记录
        if (!this.collectFlag) {
          this.$http.post({
            'url': '/collection/new_collection',
            'data': {'goods_id': this.goods.goods_id}
          }).then(res => {
            this.collectFlag = true
          })
        } else {
          //  取消收藏
          this.$http.post({
            'url': '/collection/cancel',
            'data': {'goods_id': this.goods.goods_id}
          }).then(res => {
            this.collectFlag = false
          })
        }
      } else {
        //  未登录则弹窗询问是否登录
        this.$login.showLoginModal()
      }
    },
    //  购买
    buy () {
      if (this.loginFlag) {
        console.log('点击了购买')
        let arr = [{'goods_id': this.goods.goods_id, 'count': this.count}]
        if (this.upFlag) {
          this.$http.post({
            url: '/order/create',
            data: {'goods': arr}
          }).then(res => {
            this.upFlag = false
            console.log('post成功')
            console.log(res)
            wx.navigateTo({
              url: '/pages/order/main?order=' + JSON.stringify(res)
            })
          }).catch(err => {
            console.log('进入失败')
            console.log(err)
            console.log(err.statusCode === 6001)
            if (err.statusCode === 406) {
              wx.showToast({
                title: err.data.msg,
                icon: 'none'
              })
            } else if (err.statusCode === 404 && err.data.errorCode === 6001) {
              console.log('进入弹窗')
              wx.showModal({
                title: '操作失败',
                content: err.data.msg,
                confirmText: '去完善',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击了确定')
                    let obj = {
                      'isCreate': true,
                      'addressData': {}
                    }
                    let objJson = JSON.stringify(obj)
                    wx.navigateTo({url: '/pages/address/main?info=' + objJson})
                  }
                }
              })
            }
            this.upFlag = false
          })
        } else {
          this.upFlag = true
        }
      } else {
        //  未登录则弹窗询问是否登录
        this.$login.showLoginModal()
      }
    },
    //  私聊
    chat () {
      if (this.loginFlag) {
      } else {
        //  未登录则弹窗询问是否登录
        this.$login.showLoginModal()
      }
    },
    // 组装商品属性数据
    propertiesMapping () {
      let data = this.goods.gooods_properties[0]
      this.gooodsProperties = []
      Object.keys(data).forEach(key => {
        let Obj = {
          'name': '',
          'value': ''
        }
        if (key === 'trade') {
          Obj.name = '交易方式'
          Obj.value = data[key].name
          this.gooodsProperties.push(Obj)
        } else if (key === 'new') {
          Obj.name = '新品程度'
          Obj.value = data[key]
          this.gooodsProperties.push(Obj)
        } else if (key === 'other') {
          Obj.name = '其他描述'
          Obj.value = data[key]
          this.gooodsProperties.push(Obj)
        }
      })
    },
    /** 预览图片 */
    previewImg: function (e) {
      let currentSrc = e.currentTarget.dataset.src
      wx.previewImage({
        urls: [currentSrc]
      })
    },
    // 加载商品数据
    loadData () {
      wx.showLoading({
        title: '加载中...'
      })
      let that = this
      that.$http.get({
        url: '/goods/' + this.$root.$mp.query.id
      }).then((res) => {
        this.showFlag = true
        that.goods = res
        if (res.banner) {
          that.bannerImgs = res.banner.banner_imgs
        } else {
          that.bannerImgs = []
        }
        if (res.gooods_properties) {
          that.propertiesMapping()
        } else {
          that.gooodsProperties = []
        }
      }).catch(e => {
        if (e.statusCode === 404) {
          this.showFlag = false
        }
      })
    },
    //  初始化收藏图标
    initCollect () {
      //  已登录则查看用户是否收藏当前商品
      if (this.loginFlag) {
        this.$http.get({
          url: '/collection/is_collect/' + this.$root.$mp.query.id
        }).then((res) => {
          if (res.data.code) {
            this.collectFlag = true
          } else {
            this.collectFlag = false
          }
        })
      } else {
        this.collectFlag = false
      }
    }
  },
  onLoad (option) {
    this.loadData()
    this.initCollect()
  },
  computed: {
    loginFlag () {
      return this.$store.getters.getLoginStatus
    },
    total () {
      return (this.goods.price * this.count).toFixed(2)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.no_found
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%,-50%)
.swiper
  width: 100%
  height: 417rpx
  .swiper-container
    width: 100%
    height: 100%
    .swiper-item
      width: 100%
      height: 100%
      .slide-image
        width: 100%
        height: 100
.goods-info
  width: 90%
  margin: 0 auto
  padding: 16rpx 0
  .price_stock
    display: flex
    align-items: center
    justify-content: space-between
    padding: 16rpx 0
    .price 
      font-size: 20px
      color: #df4416
    .stock
      font-size: 28rpx
  .name
    font-size: 14px
    font-weight: bold
    text-indent: 2em
    line-height: 150%
.goods-property
  width: 90%
  margin: 0 auto
  padding: 16rpx 0
  h2
    text-align: center
  ul
    padding: 16rpx 0
    width: 100%
    li
      width: 100%
      border-bottom: 1rpx solid gray
      display:flex
      span 
        display: inline-block
        margin: 10rpx 0
        font-size: 14px
      .property-name
        flex: 0 1 200rpx
        color: black
      .property-value
        flex: 1
        color: black
.bottom-fixed
  position: fixed
  bottom: 0
  left: 0
  right: 0
  width: 750rpx
  height: 100rpx
  display: flex
  background: #fff
  z-index: 10
  div:nth-child(1) 
    height: 100rpx
    width: 162rpx
    border: 1rpx solid #f4f4f4
    display: flex
    align-items: center
    justify-content: center
    .collect 
      display: block
      height: 44rpx
      width: 44rpx
      border: none
      background: url('../../../static/images/icon_collect.png') no-repeat
      background-size: 100% 100%
      &.active
        display: block
        height: 44rpx
        width: 44rpx
        background: url('../../../static/images/icon_collect_checked.png') no-repeat
        background-size: 100% 100%
  div:nth-child(2)
    height: 100rpx
    line-height: 96rpx
    flex: 1
    text-align: center
    color: #333
    border-top: 1rpx solid #f4f4f4
    border-bottom: 1rpx solid #f4f4f4
  div:nth-child(3)
    border: 1rpx solid #df4416
    background: #df4416
    float: left
    height: 100rpx
    line-height: 96rpx
    flex: 1
    text-align: center
    color: #fff
.choose_count
  width: 100%
  height: 25%
  position: fixed
  bottom: 100rpx
  padding: 20rpx
  box-sizing: border-box
  border-top-right-radius: 10px
  border-top-left-radius: 10px
  font-size: 32rpx
  transition: all 0.8s ease
  background: #DCDCDC
  &>div
    width: 50%
  .total
    position: absolute
    bottom: 20rpx
    right: 20rpx
    color: #df4416
.down
  transform: translateY(100%)
  
</style>
