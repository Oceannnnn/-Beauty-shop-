const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    brandList: []
  },
  onLoad(op) {
    this.scene(op); //分销二维码扫描进入
    this.getCompanyConfig();
    this.brandList()
  },
  toBrand(e) {
    main.toDetails(e, "toBrand")
  },
  scene(op) {
    let scene = '';
    if (op.scene) {
      scene = decodeURIComponent(op.scene);
    }
    if (op.invite_code) {
      scene = op.invite_code
    }
    wx.setStorage({
      key: 'scene',
      data: scene
    })
  },
  brandList() {
    util.http("brand/index", {}, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          brandList: res.data
        })
      }
    })
  },
  getCompanyConfig() {
    util.http('sms/index', {}, 'get').then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.name = info.company;
        app.globalData.phone = info.user_phone;
        app.globalData.bg = info.bg;
      }
    })
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
  },
})