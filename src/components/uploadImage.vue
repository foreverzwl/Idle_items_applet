<template>
  <div id="uploadImageWrapper">
    <div style="display:none">
      <img v-for="(item,index) in imgList" :key="item" :src="item.src" @load="getImgAttr" :data-index = 'index'/>
    </div>
    <div class="choose_img">
      <ul>
        <li :class="[(index+1)%imgColumn == 0 ? 'changePadding' : '']" 
            v-for="(item,index) in imgList" :key="index" 
            :style="{height: upLoadIconWidth+'px', width: upLoadIconWidth+'px', marginRight: imgMargin + 'px'}">
          <img :src="item.src" 
               :style="[item.isWidthShorter ? 'width: 100%' : 'height: 100%']"
               @click.stop="previewImg" 
               :data-src='item.src' />
        </li>
        <li v-if="showUploadIcon"
            class="upload" 
            :style="{height: upLoadIconWidth+'px', width: upLoadIconWidth+'px'}"
            @click="uploadImg()">
          <img src="/static/images/uploadImg.svg"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    'upLoadImgList': {
      type: Array,
      default: []
    },
    'imgMargin': {//  图片间距
      type: Number,
      default: 5
    },
    'imgColumn': {//  每行图片列数
      type: Number,
      default: 3
    },
    'maxUploadNum': {//   最大上传图片数量
      type: Number,
      default: 9
    }
  },
  data () {
    return {
      width: -1
    }
  },
  computed: {
    imgList: {
      get () {
        return this.upLoadImgList
      },
      set (newVal) {
        //  将选中的图片返回给父组件，由父组件更新数组后引起子组件upLoadImgList、imgList值改变
        this.$emit('getUpLoadImg', newVal)
      }
    },
    //  是否显示上传图片按钮
    showUploadIcon () {
      return this.imgList.length < this.maxUploadNum
    },
    //  计算图片应有宽度
    upLoadIconWidth () {
      //  计算需要减去的边距
      let reduceMargin = this.imgMargin * (this.imgColumn - 1)
      return (this.width - reduceMargin) / this.imgColumn
    }
  },
  watch: {
    //  监控父组件传递过来的值
    upLoadImgList: {
      handler (newVal, oldVal) {
      },
      immediate: true
    },
    //  获取当前整个组件的宽度
    width: {
      handler (n, o) {
        let query = wx.createSelectorQuery()
        query.select('#uploadImageWrapper').boundingClientRect()
        query.exec(res => {
          this.width = res[0].width
        })
      },
      immediate: true
    }
  },
  methods: {
    //  上传图片
    uploadImg () {
      let that = this
      wx.chooseImage({
        count: that.maxUploadNum - that.imgList.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.$nextTick(() => {
            let arr = res.tempFilePaths.map(item => {
              let obj = {}
              obj.src = item
              obj.isWidthShorter = true
              return obj
            })
            that.imgList = that.imgList.concat(arr)
          })
          // console.log(res)
        },
        fail (err) {
          console.log(err)
        }
      })
    },
    /** 预览图片 */
    previewImg (e) {
      let currentSrc = e.currentTarget.dataset.src
      wx.previewImage({
        urls: [currentSrc]
      })
    },
    //  获取当前加载图片的属性
    getImgAttr (e) {
      let index = e.currentTarget.dataset.index
      if (e.target.width > e.target.height) {
        this.imgList[index].isWidthShorter = false
      } else {
        this.imgList[index].isWidthShorter = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
</style>
