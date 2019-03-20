// pages/classify/classify.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    navHide: false,
    page: 1,
    onBottom: true,
    searchPageList: [],
    searchValue: ''
  },
  onLoad(options) {
    this.init()
  },
  init() {
    util.http('category/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          navLeftItems: res.data,
          navRightItems: res.data[0].item,
          curNav: res.data[0].id
        })
      }
    })
  },
  toList(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    let navLeftItems = this.data.navLeftItems;
    this.setData({
      searchValue:'',
      curNav: id,
      curIndex: index,
      navRightItems: navLeftItems[index].item
    })
    this.close();
  },
  toDetails(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "goodsDetails")
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
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init()
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  bindconfirm(e) {
    let value = e.currentTarget.dataset.value;
    if (value) {
      this.setData({
        searchValue: value
      })
    }
    this.bindsearch()
  },
  bindsearch() {
    let searchValue = this.data.searchValue;
    if (searchValue != '' && searchValue != undefined) {
      this.setData({
        page: 1,
        onBottom: true,
        searchPageList: [],
        navHide:true
      })
      this.searchPage(searchValue, 1)
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: "none"
      })
    }
  },
  searchPage(searchValue, page) {
    let list = this.data.searchPageList;
    util.http('index/search', {
      keywords: searchValue,
      page: page,
      size: 10
    }, 'post').then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            searchPageList: list
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
      this.searchPage(this.data.allorderType, page);
    }
  },
  searchValue(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  close() {
    this.setData({
      navHide: !this.data.navHide
    })
  }
})