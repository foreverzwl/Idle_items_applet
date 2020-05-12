<template>
  <div class="page" >
    <div class='view'>
      <div class="content" v-for='(item, index) in firstList' :key='index' @click="goodsDetail(item.goods_id)"
           :style="{ width: imgWidth+'px', height:(item.height + 55)+'px', marginTop: imgMargin+'px',marginLeft:imgMargin + 'px'}" >
        <div class="img-content" :style="{height:item.height + 'px'}">
          <img :src='item.main_img_url'
                class="image"
                :data-index='index' data-type='1'
                alt=""/>
        </div>
        <div>
          <p class="text">{{item.description}}</p>
          <div class="price_box">
            <span class="price">{{item.price}}</span>
            <img @click.stop="offGoods(item)" v-if="editable" src="/static/images/off.png" />
          </div>
        </div>
      </div>
    </div>
    <div class='view'>
      <div class="content" v-for='(item, index) in secondList' @click="goodsDetail(item.goods_id)"
           :style="{marginLeft:(imgMargin/2)+'px', width: imgWidth+'px', height:(item.height + 55)+'px',marginTop: imgMargin+'px'}"
           :key='index'>
        <div class="img-content"  :style="{height:item.height+'px'}">
          <img :src='item.main_img_url'
                class="image"
               :data-index='index' data-type='2'
                alt=""/>
        </div>
        <div>
          <p class="text">{{item.description}}</p>
          <div class="price_box">
            <span class="price">{{item.price}}</span>
            <img @click.stop="offGoods(item)" v-if="editable" src="/static/images/off.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOwner: false,
      firstList: [], // 第一列数组
      secondList: [], // 第二列数组
      windowWidth: 0, // 页面视图宽度
      windowHeight: 0, // 视图高度
      imgMargin: 10, // 图片边距: 单位px
      imgWidth: 0, // 图片宽度: 单位px
      topArr: [0, 0] // 存储每列的累积top
    }
  },
  computed: {
    imgList: {
      get () {
        let arr = []
        if (this.dataList.length > 0) {
          let promiseParam = []
          this.dataList.forEach((item, index) => {
            let promise = this.getImageInfo(item.main_img_url).then(res => {
              let obj = {}
              obj.description = item.description
              obj.price = item.price
              obj.goods_id = item.goods_id
              if (res === null) {
                obj.width = 313
                obj.height = 230
                obj.main_img_url = '../../static/images/defalut.jpg'
              } else {
                obj.width = res.width
                obj.height = res.height
                obj.main_img_url = item.main_img_url
              }
              return obj
            })
            promiseParam.push(promise)
          })
          //  得到有序数组
          arr = Promise.all([...promiseParam]).then(values => {
            //  对图片进行分组
            this.devideImg(values)
            return values
          })
        }
        return arr
      }
    }
  },
  watch: {
    dataList: {
      handler (newVal, oldVal) {
        //  来源数据改变时清空两列通道
        this.firstList = []
        this.secondList = []
      },
      deep: true
    }
  },
  methods: {
    //  查询图片实际宽高
    getImageInfo (url) {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success (res) {
            resolve(res)
          },
          fail () {
            let res = null
            resolve(res)
          }
        })
      })
    },
    // 对图片进行分组，左右两组
    devideImg (arr) {
      // 第一列的累积高度，和第二列的累积高度
      let firstColH = this.topArr[0]
      let secondColH = this.topArr[1]
      let imgWidth = this.imgWidth // 应显示图片宽度
      let margin = this.imgMargin // 图片间距
      //  准备第一列、第二列存放图片
      let firstList = this.firstList
      let secondList = this.secondList

      arr.forEach((item, index) => {
        //  根据图片原始宽高比计算应显示图片高度
        let imgScaleH = imgWidth / item.width * item.height
        let obj = item
        obj.width = this.imgWidth
        obj.height = imgScaleH
        if (firstColH <= secondColH) { // 如果第一列总体高度低，将图片放到第一列
          firstColH += margin + obj.height
          firstList.push(obj)
        } else { // 放到第二列
          secondColH += margin + obj.height
          secondList.push(obj)
        }
      })
      this.firstList = firstList
      this.secondList = secondList
      this.topArr = [firstColH, secondColH]
    },
    //  跳转商品详情
    goodsDetail (id) {
      wx.navigateTo({
        url: '../goods/main?id=' + id
      })
    },
    //  获取页面宽高
    initPage () {
      wx.showLoading({
        title: '加载中...'
      })
      let that = this
      // 获取页面宽高度
      wx.getSystemInfo({
        success: function (res) {
          let windowWidth = res.windowWidth
          let imgMargin = that.imgMargin
          // 两列，每列的图片宽度
          let imgWidth = (windowWidth - imgMargin * 3) / 2
          that.windowWidth = windowWidth
          that.windowHeight = res.windowHeight
          that.imgWidth = imgWidth
          wx.hideLoading()
        }
      })
    },
    //  下架商品
    offGoods (item) {
      let that = this
      wx.showModal({
        content: '是否下架该商品',
        confirmText: '确定',
        success (res) {
          if (res.confirm) {
            that.$http.get({
              'url': '/goods/my/off/' + item.goods_id
            }).then((res) => {
              that.dataList = that.dataList.filter(e => e !== item)
            })
          }
        }
      })
    }
  },
  onLoad () {
    this.initPage()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.page
  width: 100%
  .view
    display: inline-block !important
    position: relative
    vertical-align: top
    width: 50%
    .content 
      box-shadow: 0 0 5px silver
      border-radius: 4px
      .img-content 
        .image 
          width: 100%
          height: 100%
          border-top-right-radius: 4px
          border-top-left-radius: 4px
      .text 
        padding: 5px 8px 0 8px
        font-size: 14px
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 1
        word-break:break-all
      .price_box
        display: flex
        padding: 5px 8px 5px 8px
        align-items: center
        img
          width: 48rpx
          height: 48rpx
          z-index: 999
        .price 
          font-size: 14px
          color: #df4416
          flex: 1
</style>
