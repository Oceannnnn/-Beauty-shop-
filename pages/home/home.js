const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    imgUrls: [],
    homeList: [],
    page: 1,
    onBottom: true
  },
  onLoad() {
    util.http("index/banner", {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    util.http("index/promotion", {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          group: res.data.group,
          sec: res.data.sec
        })
      }
    })
    this.homeList(1);
  },
  homeList(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.homeList;
    let token = app.globalData.token;
    util.http('index/product', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            homeList: list
          })
        } else {
          if (page > 1) {
            wx.showToast({
              title: '没有数据啦！',
              icon: 'none',
              duration: 2000
            })
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.homeList(page);
    }
  },
  toDetails(e) {
    main.toDetails(e, "goodsDetails")
  },
  toCoupon(e) {
    main.toDetails(e, "consumer")
  },
  onShareAppMessage() {
    let invite_code = ""
    if (wx.getStorageSync("invite_code")) {
      invite_code = wx.getStorageSync("invite_code");
    }
    return {
      title: '分享不仅仅是一种生活，更是收获',
      path: '/pages/index/index?invite_code=' + invite_code
    }
  }
})