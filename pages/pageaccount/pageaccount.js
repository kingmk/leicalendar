// pages/pageaccount/pageaccount.js
var util = require('../../utils/util.js');

var qrcodes = [{
  image: "http://cdnstatic.leimenyi.com.cn/filedata0/static/qrcode_wx00.png",
  title: "雷门易微信订阅号",
  detail: {
    title: "前往公众号",
    desc: "发现更多有趣的风水命理文章",
    hasSearch: true,
    searchinfo: "公众号搜索“雷門易”",
    image: "http://cdnstatic.leimenyi.com.cn/filedata0/static/qrcode_wx00.png"
  }
}, {
    image: "http://cdnstatic.leimenyi.com.cn/filedata0/static/qrcode_wx01.png",
  title: "雷门易测算平台",
  detail: {
    title: "前往测算平台",
    desc: "解锁更多专业一对一命理测试",
    hasSearch: true,
    searchinfo: "公众号搜索“雷門易测算平台”",
    image: "http://cdnstatic.leimenyi.com.cn/filedata0/static/qrcode_wx01.png"
  }
}, {
    image: "http://cdnstatic.leimenyi.com.cn/filedata0/static/qrcode_mall.png",
  title: "雷门易官方有赞商城",
  detail: {
    title: "前往商城",
    desc: "获取更多开运化煞好礼",
    hasSearch: false,
    image: "http://cdnstatic.leimenyi.com.cn/filedata0/static/qrcode_mall.png"
  }
}]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodes: qrcodes,
    showQrcode: false,
    qrdetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return util.shareProp;
  },

  goUserinfo: function(e) {
    
    wx.navigateTo({
      url: '../pageuserinfo/pageuserinfo?type=update',
    })
  },

  goIntro: function (e) {
    wx.navigateTo({
      url: '../pageintro/pageintro?from=account',
    })
  },

  goAgreement: function (e) {
    wx.navigateTo({
      url: '../pageagreement/pageagreement?from=account',
    })
  },

  clickQrcode: function(e) {
    // console.log(e);
    var idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({
      showQrcode: true,
      qrdetail: qrcodes[idx].detail
    })
  },

  clickHideQr: function(e) {
    this.setData({
      showQrcode: false,
      qrdetail: null
    })
  }
})