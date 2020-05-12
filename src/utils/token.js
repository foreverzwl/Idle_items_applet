import Config from './config'
import Vue from 'vue'

let vue = new Vue()

function verify () {
  let token = wx.getStorageSync('token')
  if (!token) {
    // 不存在token缓存，获取token
    getTokenFromServer()
  } else {
    // 对缓存中的token进行验证
    verifyFromServer(token)
  }
}

//  从服务器获取token
function getTokenFromServer () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        wx.request({
          url: Config.baseUrl + '/token/user',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            vue.$store.commit('UPDATE_TOKEN', res.data.token)
            resolve(res.data.token)
          }
        })
      }
    })
  })
}

// 携带令牌去服务器校验
function verifyFromServer (token) {
  wx.request({
    url: Config.baseUrl + '/token/verify',
    method: 'POST',
    data: {
      token: token
    },
    success: function (res) {
      let valid = res.data.isValid
      if (!valid) {
        getTokenFromServer()
      }
    }
  })
}

export default{
  verify,
  getTokenFromServer,
  verifyFromServer
}
