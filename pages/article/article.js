// pages/toBrand/toBrand.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
Page({
  data: {

  },
  onLoad(op) {
    util.http("article/detail", { id: op.id }, 'post').then(res => {
      if (res.code == 200) {
        WxParse.wxParse('details', 'html', res.data.content, this, 0)
      }
    })
  }
})