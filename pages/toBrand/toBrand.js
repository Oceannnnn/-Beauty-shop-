// pages/toBrand/toBrand.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
Page({
  data: {

  },
  onLoad(op) {
    if(op.type==1){
      this.setData({
        type:op.type,
        id:op.id
      })
      util.http("distributor/detail", { id: op.id }, 'post').then(res => {
        if (res.code == 200) {
          WxParse.wxParse('details', 'html', res.data.content, this, 0)
        }
      })
      return
    }
    util.http("brand/detail", {id:op.id}, 'post').then(res => {
      if (res.code == 200) {
        WxParse.wxParse('details', 'html', res.data.content, this, 0)
      }
    })
  },
  order() {
    let token = app.globalData.token;
    util.http("distributor/order", { id: this.data.id }, 'post').then(res => {
      if (res.code == 200) {
        wx.showModal({
          title: '提示',
          confirmText: '返回首页',
          cancelText: '留在当前',
          content: '下单完成！',
          confirmColor: '#F02F72',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index'
              })
            } 
          }
        })
      }
    })
  }
})