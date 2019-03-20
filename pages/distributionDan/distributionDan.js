const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    currentId: 1,
    HeaderList: [{
      name: "套餐列表",
      id: 1
    }, {
      name: "订单列表",
      id: 2
    }],
    page: 1,
    onBottom: true,
    productsList: []
  },
  onLoad() {
    this.productsList(1,1)
  },
  toBrand(e) {
    main.toDetails(e, "toBrand")
  },
  toList(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id,
      page: 1,
      onBottom: true,
      productsList: []
    })
    this.productsList(1, id)
  },
  productsList(page, id) {
    let json = {
      size: 10,
      page: page,
      type: id
    }
    let list = this.data.productsList;
    let token = app.globalData.token;
    util.http("distributor/products", json, 'post').then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            productsList: list
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
      this.productsList(page, this.data.currentId);
    }
  },
})