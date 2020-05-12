//  显示弹窗
export function showToast (content, confirmText, url) {
  wx.showModal({
    content: content,
    confirmText: confirmText,
    success (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: url
        })
      }
    }
  })
}

export default {
  showToast
}
