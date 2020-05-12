import Vue from 'vue'

let vue = new Vue()

//  登录获取openid
function login () {
  wx.showLoading()
  return new Promise((resolve, reject) => {
    wx.login({
      success (res) {
        if (res.code) {
          let result = res
          //  登录成功，获取用户信息
          getUserInfo().then((res) => {
            //  此处res是getUserInfo获得的用户信息
            return vue.$http.post({
              'url': '/token/user',
              'data': {'code': result.code}
            })
          }).then((res) => {
            //  此处res是post请求获得的token
            wx.hideLoading()
            wx.navigateBack()
            //  此处将token存储起来
            vue.$store.commit('SET_TOKEN', res.token)
            wx.setStorageSync('token', res.token)
            resolve(result)
          }).catch((res) => {
            showToast()
          })
        } else {
          showToast()
        }
      },
      fail () {
        showToast()
      }
    })
  })
}

//  获取用户信息
function getUserInfo () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      //  获取用户信息成功
      success (res) {
        console.log(res)
        vue.$store.commit('SET_USERINFO', res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        resolve(res.userInfo)
      },
      fail () {
        wx.hideLoading()
        //  获取用户信息失败，清除全局存储的登录状态
        vue.$store.commit('UPDATE_TOKEN', '')
        wx.setStorageSync('userInfo', '')
        //  显示一键登录
        showLoginModal()
      }
    })
  })
}

//  toast弹窗
function showToast (content = '登录失败，请稍后再试') {
  wx.showToast({
    title: content,
    icon: 'none'
  })
}

//  显示一键登录的弹窗
function showLoginModal () {
  wx.showModal({
    title: '提示',
    content: '你还未登录，请先登录',
    confirmText: '一键登录',
    success (res) {
      //    点击一键登录，去授权页面
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/login/main'
        })
      }
    }
  })
}

function isLogin () {
  if (!wx.getStorageSync('token')) {
    showLoginModal()
    return false
  } else {
    return true
  }
}

export default {
  login,
  showLoginModal,
  isLogin,
  showToast
}
