<template>
  <div class="wrapper">
    <div>
      <uploadImage @getUpLoadImg="getUpLoadImg" :upLoadImgList='upLoadImgList'></uploadImage>
    </div>
    <div class="properties">
      <div>
        <span class="mark"> * </span>
        <label class="title">商品描述：</label>
        <textarea class="text_input" placeholder='请输入商品描述' maxlength='255' v-model="description"></textarea>
      </div>
      <div class="input_box">
        <span class="mark"> * </span>
        <label class="title">存量：</label>
        <input v-model='stock' type="number" @blur="mustBigZero" />
      </div>
      <div class="input_box">
        <span class="mark"> * </span>
        <label class="title">价格：</label>
        <input class="price" v-model='price' type="digit" @blur="toBeFloat"/>
      </div>
      <div class="input_box">
        <span class="mark"> * </span>
        <label class="title">所属分类：</label>
        <selectBox @selectedValue="updateBelongsCategory" :selectList="categoryList" ></selectBox>
      </div>
      <div>
        <span class="mark"> * </span>
        <label class="title">新品程度：</label>
        <div class="radio_box">
          <radio-group class="radio-group" @change="radioChange">
            <label class="radio">
              <radio color='#85A5CC' value="1" :checked="isNew"  />全新
            </label>
            <label class="radio">
              <radio color='#85A5CC' value="0" :checked="!isNew"  />非全新
            </label>
          </radio-group>
          <div class="new_box">
            <numberBox @getNumberBoxValue="getNumberBoxValue" v-if="!isNew" :unit='unit' :num='newNum'></numberBox>
          </div>
        </div>
      </div>
      <div class="input_box">
        <span class="mark"> * </span>
        <label class="title">交易方式：</label>
        <selectBox @selectedValue="updateTrade" :selectList="tradeList" ></selectBox>
      </div>
      <div>
        <label class="title">其他属性描述：</label>
        <textarea class="text_input" placeholder='请输入商品的其他属性描述' maxlength='255' v-model="otherProperty"></textarea>
      </div>
    </div>
    <div class="submit">
      <button @click="createGoods">发布</button>
    </div>
  </div>
</template>

<script>
import uploadImage from '@/components/uploadImage'
import numberBox from '@/components/numberBox'
import selectBox from '@/components/selectBox'
import config from '../../utils/config'
import token from '../../utils/token'
export default {
  data () {
    return {
      upLoadImgList: [],
      newNum: 9,
      other: '',
      isNew: true,
      unit: '成新',
      tradeList: [],
      categoryList: [],
      belongsCategory: 1,
      trade: 1,
      description: '',
      otherProperty: '',
      stock: 1,
      price: 1.0
    }
  },
  components: {
    uploadImage,
    numberBox,
    selectBox
  },
  methods: {
    //  接收子组件传值，获取新品程度
    getNumberBoxValue (val) {
      this.newNum = val
    },
    //  接收子组件传值，获取上传的图片
    getUpLoadImg (val) {
      this.upLoadImgList = val
    },
    //  接收子组件传值，获取选中的分类
    updateBelongsCategory (val) {
      this.belongsCategory = val
    },
    //  接收子组件传值，获取选中的交易方式
    updateTrade (val) {
      this.trade = val
    },
    //  对输入框的值做校验
    mustBigZero (e) {
      let value = Number(e.mp.detail.value).toFixed(0)
      if (value <= 0) {
        this.stock = 1
      } else {
        this.stock = value
      }
    },
    //  对输入框的值做校验
    toBeFloat (e) {
      let value = Number(e.mp.detail.value).toFixed(2)
      if (value <= 0.0) {
        this.price = 0.1
      } else {
        this.price = value
      }
    },
    radioChange (e) {
      let value = e.mp.detail.value
      if (value - 0 > 0) {
        this.isNew = true
        this.newNum = 10
      } else {
        this.isNew = false
      }
    },
    async initTradeData () {
      this.tradeList = await this.$http.get({
        'url': '/trade/all'
      }).catch(() => {
        return []
      })
    },
    async initCategoryData () {
      let arr = await this.$http.get({
        'url': '/category/all'
      }).catch(() => {
        return []
      })
      this.categoryList = JSON.parse(JSON.stringify(arr).replace(/category_id/g, 'code'))
    },
    //  创建商品
    createGoods () {
      if (this.description === '') {
        wx.showToast({
          title: '商品描述不能为空',
          icon: 'none'
        })
        return 0
      } else if (this.upLoadImgList.length === 0) {
        wx.showToast({
          title: '至少上传一张图片',
          icon: 'none'
        })
        return 0
      }
      let goods = {
        'category_id': this.belongsCategory,
        'description': this.description,
        'stock': this.stock,
        'price': this.price
      }
      let goodsProperties = {
        'new': this.newNum,
        'trade_code': this.trade,
        'other': this.otherProperty
      }
      let data = {
        'goods': goods,
        'goods_properties': goodsProperties
      }
      this.$http.post({
        'url': '/goods/my/new_goods',
        'data': data
      }).then(res => {
        //  校验token，过期自动获取token
        token.verify()
        console.log('post成功')
        console.log(res)
        //  为promise.all准备传入参数：元素类型是promise的数组
        let promiseAllParam = []
        this.upLoadImgList.forEach((item, index) => {
          console.log('进入循环')
          console.log(res)
          promiseAllParam.push(this.uploadFile(item.src, res, index + 1))
        })
        console.log('即将进入promiseall')
        Promise.all([...promiseAllParam]).then((values) => {
          wx.showToast({
            title: '所有图片上传成功，商品发布成功',
            icon: 'none'
          })
        }).catch(err => {
          console.log('promise.all进入失败')
          wx.showToast({
            title: '图片上传失败，请在我的发布中更新商品信息',
            icon: 'none'
          })
          console.log(err)
        })
      })
    },
    //  用promise封装wx.uploadFile得到自己的上传图片功能函数
    uploadFile (filePath, goodsId, order) {
      return new Promise((resolve, reject) => {
        console.log(filePath)
        wx.uploadFile({
          url: config.baseUrl + '/banner/my/upload_images/' + goodsId,
          filePath: filePath,
          name: 'image',
          formData: {
            'order': order
          },
          header: {
            'token': wx.getStorageSync('token'),
            'content-type': 'multipart/form-data'
          },
          success (res) {
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          },
          fail (err) {
            console.log(err)
            reject(err)
          }
        })
      })
    }
  },
  //  退出当前页面时清除数据
  onUnload () {
    this.upLoadImgList = []
    this.description = ''
    this.otherProperty = ''
  },
  onLoad () {
    this.initTradeData()
    this.initCategoryData()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  padding: 20rpx
  .choose_img
    ul
      li
        display: inline-block
        overflow: hidden
      .changePadding
        margin-right: 0 !important
      .upload>img
        width: 100%
        height: 100%
  .properties
    font-size: 34rpx
    &>div
      padding: 20rpx 0
      display: flex
      line-height: 150%
      &>input
        width: 100%
        border: 1rpx solid #f4f4f4
        text-align: center
        padding: 10rpx 0
    .input_box
      align-items: center
    .price
      color: red
    .mark
      color: red;
      margin-right: 10rpx;
    .title
      white-space: nowrap
      .radio-group
        display: flex
        justify-content: space-around
    .radio_box
      width: 100%
      &>radio-group
        display: flex
        justify-content: space-around
    .text_input
      width: 100%
      border: 1rpx solid #f4f4f4
      padding: 10rpx
  .submit
    width: 100%
    padding: 20rpx 0
    button
      background: #85A5CC
      color: white
</style>
