const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad() {
    this.animation = wx.createAnimation()
    this.rotate();
    this.setData({
      name: app.globalData.name,
      phone: app.globalData.phone,
      address: app.globalData.address,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      bg: app.globalData.bg,
      markers: [{
        iconPath: "../../images/add.png",
        id: 0,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        width: 30,
        height: 30
      }]
    })
  },
  toCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toPosition() {
    wx.openLocation({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      name: this.data.address,
      scale: 15
    })
  },
  rotate: function() {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function(res) {}
    });
    setInterval(function() {
      if (circleCount % 2 == 0) {
        this.animation.rotate(30).step();
      } else {
        this.animation.rotate(-10).step();
      }
      this.setData({
        animation: this.animation.export()
      })
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 200);
  },
  call() {
    let phoneNumber = this.data.user_phone.toString()
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  bindName(e) {
    this.setData({
      sms_name: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      sms_phone: e.detail.value
    })
  },
  bindtap() {
    let name = this.data.sms_name;
    let phone = this.data.sms_phone;
    if (!name) {
      wx.showToast({
        title: '请输入名字',
        icon: "none"
      })
      return
    } else if (!phone) {
      wx.showToast({
        title: '请输入电话',
        icon: "none"
      })
      return
    }
    if (!util.toCheck(phone)) {
      wx.showToast({
        title: '请输入正确电话',
        icon: "none"
      })
      return
    }
    let token = app.globalData.token;
    util.http('sms/makeProcedure', {
      name: name,
      mobile: phone
    }, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          name: '',
          phone: ''
        })
        wx.showModal({
          content: '发送成功，客服会在一天内回复您！',
          confirmText: "返回首页",
          confirmColor: "#5E83C5",
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../index/index',
              })
            }
          }
        })
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
  }
})