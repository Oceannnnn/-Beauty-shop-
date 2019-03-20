// pages/distribution/distribution.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
  
  },
  onShow() {
    this.init()
    main.uploadFormIds();
  },
  init(){
    let token = app.globalData.token;
    util.http('distributor/index', {}, 'get', token).then(res => {
      if(res.code==200){
        this.setData({
          userInfo: app.globalData.userInfo,
          can_money: res.data.can_money,
          num: res.data.num,
          un_money: res.data.un_money,
          yet_money: res.data.yet_money,
          money: res.data.money
        })
      }
    })
  },
  allorder(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../allorder/allorder?id=' + data.id + '&type=' + data.type + '&allorder=' + data.allorder,
    })
  },
  toMoney() {
    wx.navigateTo({
      url: '../distributionMoney/distributionMoney?money=' + this.data.money + '&can_money=' + this.data.can_money + '&yet_money=' + this.data.yet_money,
    })
  },
  goCommission(e) {
    main.toDetails(e, "distributionCommission")
  },
  toExpressive(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "distributionExpressive")
  },
  bindsubmit(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
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