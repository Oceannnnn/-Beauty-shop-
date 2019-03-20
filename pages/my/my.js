// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    hasUserInfo: false,
    // distributionHidden: true,
    state: 0,
    balance: 0,
    integral: 0
  },
  onLoad() {
    util.http('article/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          article: res.data
        })
      }
    })
  },
  onShow() {
    this.init()
    if (this.data.hasUserInfo) {
      let token = app.globalData.token;
      util.http('member/info', {}, 'get', token).then(res => {
        if (res.code == 200) {
          this.setData({
            balance: res.data.balance,
            integral: res.data.integral
          })
        } else if (res.code == 201) {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      })
    }
  },
  allorder(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let data = e.currentTarget.dataset
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../allorder/allorder?id=' + data.id + '&type=' + data.type + '&allorder=' + data.allorder,
      })
    }
  },
  collection(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../collection/collection'
      })
    }
  },
  bargain(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../myBargain/myBargain'
      })
    }
  },
  cart(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.switchTab({
        url: '../cart/cart'
      })
    }
  },
  coupons(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../coupons/coupons'
      })
    }
  },
  redPacket(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../redPacket/redPacket'
      })
    }
  },
  myadd(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../myadd/myadd'
      })
    }
  },
  // distributionHidden() {
  //   this.setData({
  //     distributionHidden: !this.data.distributionHidden
  //   })
  // },
  getUserInfo(e) {
    let that = this;
    let scene = '';
    if (wx.getStorageSync('scene')) {
      scene = wx.getStorageSync('scene')
    }
    wx.login({
      success: function(res) {
        let code = res.code
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  let encryptedData = msg.encryptedData;
                  let iv = msg.iv;
                  let token = '';
                  let json = {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv,
                    invite_code: scene
                  }
                  json = JSON.stringify(json)
                  util.http('login/login', json, 'post', token).then(data => {
                    if (data.code == 200) {
                      main.member();
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.distributor = data.data.distributor;
                      that.setData({
                        state: 1,
                        hasUserInfo: true,
                        userInfo: e.detail.userInfo
                      })
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo,
                          distributor: data.data.distributor,
                        }
                      })
                      wx.setStorage({
                        key: "invite_code",
                        data: data.data.invite_code
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(() => {
                        wx.switchTab({
                          url: '../index/index'
                        })
                      }, 500)
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '授权才能登录哦！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  bindName(e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      inputPhone: e.detail.value
    })
  },
  bindIDCard(e) {
    this.setData({
      id_card: e.detail.value
    })
  },
  bindBank(e) {
    this.setData({
      bank: e.detail.value
    })
  },
  bindAccount(e) {
    this.setData({
      account: e.detail.value
    })
  },
  bindtapUp() {
    // var user_name = this.data.inputName,
    //   mobile = this.data.inputPhone,
    //   id_card = this.data.id_card,
    //   bank = this.data.bank,
    //   account = this.data.account;
    // if (user_name == '') {
    //   wx.showToast({
    //     title: '请输入姓名',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (mobile == '') {
    //   wx.showToast({
    //     title: '请输入电话',
    //     icon: 'none'
    //   })
    //   return
    // }
    // let json = {
    //   user_name: user_name,
    //   mobile: mobile,
    //   id_card: id_card,
    //   bank: bank,
    //   account: account
    // }
    let token = app.globalData.token;
    util.http('Distributor/register', {}, 'post', token).then(res => {
      if (res.code == 200) {
        wx.setStorage({
          key: "distributor",
          data: 1
        })
        wx.setStorage({
          key: "invite_code",
          data: res.data
        })
        wx.showToast({
          title: '申请成功',
          icon: 'success',
          duration: 1000
        })
        // this.distributionHidden();
        setTimeout(() => {
          wx.navigateTo({
            url: '../distribution/distribution'
          })
        }, 500)
      }
    })
  },
  distribution(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let type = e.currentTarget.dataset.type;
    if (this.data.hasUserInfo == 1) {
      if (app.globalData.distributor == 1) {
        if (type == 1) {
          wx.navigateTo({
            url: '../distributionQRCode/distributionQRCode'
          })
          return
        }
        if (type == 2) {
          wx.navigateTo({
            url: '../distributionDan/distributionDan'
          })
          return
        }
        wx.navigateTo({
          url: '../distribution/distribution'
        })
      } else {
        let distributor = wx.getStorageSync('distributor');
        if (distributor == 1) {
          if (type == 1) {
            wx.navigateTo({
              url: '../distributionQRCode/distributionQRCode'
            })
            return
          }
          if (type == 2) {
            wx.navigateTo({
              url: '../distributionDan/distributionDan'
            })
            return
          }
          wx.navigateTo({
            url: '../distribution/distribution'
          })
        } else {
          let that = this;
          wx.showModal({
            title: '提示',
            content: '确认申请吗？',
            success(res) {
              if (res.confirm) {
                that.bindtapUp()
              } else if (res.cancel) {
              }
            }
          })
        }
      }
    }
  },
  article(e) {
    main.toDetails(e, "article")
  },
  init() {
    this.setData({
      state: app.globalData.state,
      order: [{
        name: "待付款",
        icon: "daifukuan",
        allorder: "pay",
        id: 1
      }, {
        name: "待发货",
        icon: "daifahuo",
        allorder: "deliver",
        id: 2
      }, {
        name: "待收货",
        icon: "daishouhuo",
        allorder: "receive",
        id: 3
      }, {
        name: "待评价",
        icon: "daipingjia",
        allorder: "evaluate",
        id: 4
      }]
    })
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      })
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init()
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})