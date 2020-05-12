const getters = {
  getLoginStatus (state) {
    if (state.token) {
      return true
    } else if (wx.getStorageSync('token')) {
      return true
    } else {
      return false
    }
  }
}
export default getters
