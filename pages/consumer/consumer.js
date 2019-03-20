// pages/consumer/consumer.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    currentId: 1,
    HeaderList: [{
      name: "满减优惠券",
      id: 1
    }, {
      name: "折扣优惠券",
      id: 2
    }],
  },
  onLoad(op) {
    this.couponList()
    main.uploadFormIds();
  },
  toList(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id
    })
  },
  couponList() {
    let token = app.globalData.token;
    util.http('index/coupon', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          money_off: res.data.money_off,
          discount: res.data.discount
        })
      }
    })
  },
  toVoucher(e) {
    let couponList = [];
    let id = e.currentTarget.dataset.coupon_id;
    let index = e.currentTarget.dataset.index;
    let currentId = this.data.currentId;
    if (currentId == 1) {
      couponList = this.data.money_off
    } else {
      couponList = this.data.discount
    }
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      util.http('coupon/getcoupon', {
        id: id
      }, 'post', token).then(res => {
        if (res.code == 200) {
          couponList[index].status = 1;
          if (currentId == 1) {
            this.setData({
              money_off: couponList
            })
          } else {
            this.setData({
              discount: couponList
            })
          }
          main.toVoucher()
        }
      })
    } else {
      main.goLogin(1)
    }
  },
  goHome() {
    wx.switchTab({
      url: '../index/index'
    })
  }
})