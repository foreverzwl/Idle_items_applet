const userPageData = {
  'firTabCard': {
    'title': '买家身份',
    'urlData': [
      [
        {
          'name': '我的收藏',
          'src': '/static/images/my_collection.png',
          'nav': '/pages/collection/main'
        },
        {
          'name': '等待同意',
          'src': '/static/images/apply.png',
          'nav': '/pages/orderList/main?type=wait'
        },
        {
          'name': '进入交易',
          'src': '/static/images/business.png',
          'nav': '/pages/orderList/main?type=trading'
        },
        {
          'name': '交易成功',
          'src': '/static/images/confirm.png',
          'nav': '/pages/orderList/main?type=successful_orders'
        },
        {
          'name': '购买记录',
          'src': '/static/images/all_orders.png',
          'nav': '/pages/orderList/main?type=all'
        }
      ]
    ]
  },
  'secTabCard': {
    'title': '商家身份',
    'urlData': [
      [
        {
          'name': '我的发布',
          'src': '/static/images/release.png',
          'nav': '/pages/myRelease/main'
        },
        {'name': '待处理订单',
          'src': '/static/images/handle.png',
          'nav': '/pages/orderList/main?type=pending'
        },
        {
          'name': '进入交易',
          'src': '/static/images/business.png',
          'nav': '/pages/orderList/main?type=my_trading'
        },
        {
          'name': '出售记录',
          'src': '/static/images/all_business.png',
          'nav': '/pages/orderList/main?type=my_all_sales'
        }
      ]
    ]
  }
}

export const myReleaseData = {
  'manage': [
    {
      'name': '未下架',
      'url': '/goods/my/my_goods/on',
      'editable': true
    },
    {
      'name': '已下架',
      'url': '/goods/my/my_goods/off',
      'editable': false
    }
  ]
}

export default{
  userPageData,
  myReleaseData
}
