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
          'nav': '/pages/collection/main'
        },
        {
          'name': '待确认',
          'src': '/static/images/confirm.png',
          'nav': '/pages/collection/main'
        },
        {
          'name': '全部订单',
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
          'nav': '/pages/collection/main'
        },
        {
          'name': '进入交易',
          'src': '/static/images/business.png',
          'nav': '/pages/collection/main'
        },
        {
          'name': '全部交易',
          'src': '/static/images/all_business.png',
          'nav': '/pages/collection/main'
        }
      ]
    ]
  },
  'infoCard': {
    'title': '个人信息',
    'urlData': [
      {'name': '我的发布', 'src': ''},
      {'name': '待处理订单', 'src': ''},
      {'name': '进入交易', 'src': ''},
      {'name': '全部交易', 'src': ''}
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
