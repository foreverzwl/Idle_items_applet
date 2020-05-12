import Config from './config'
import Token from './token'

function request (url, method, data, header = {}, noRefetch = false) {
  wx.showLoading({
    title: '加载中' //  数据请求前loading
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: Config.baseUrl + url,
      method: method,
      data: data,
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      success: function (res) {
        let code = res.statusCode.toString()
        let startChar = code.charAt(0)
        if (startChar === '2') {
          resolve(res.data)
        } else {
          if (code === '401') {
            if (!noRefetch) {
              Token.getTokenFromServer().then((token) => {
                //  获取token之后重新发送请求
                request(url, method, data, {}, true).then((res) => {
                  resolve(res)
                })
              })
            }
          } else {
            reject(res)
          }
        }
      },
      fail: function (error) {
        reject(error)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}
function get (obj) {
  return request(obj.url, 'GET', obj.data)
}
function post (obj) {
  return request(obj.url, 'POST', obj.data)
}

export default {
  request,
  get,
  post
}
