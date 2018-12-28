// pages/pageday/pageday.js

var util = require('../../utils/util.js');
var shiftStartX = -1;
var shiftStartY = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var curmonth = parseInt(options.month);
    var curyear = parseInt(options.year);
    var curday = parseInt(options.day);

    this.setData({
      curYear: curyear,
      curMonth: curmonth,
      curDay: curday
    })
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

    var winH = wx.getSystemInfoSync().windowHeight;
    var winW = wx.getSystemInfoSync().windowWidth;
    var rpx = winW / 750;
    var top = 120 * rpx;
    var h = winH - top;
    this.setData({
      scrollH: h
    })

    var self = this;
    var scrollDay = self.selectComponent("#scroll-day");
    var hblock = this.data.scrollH/5;
    scrollDay.initComponent(hblock, self.data.curYear, self.data.curMonth, self.data.curDay);

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
  
  },

  touchStart: function (e) {
    shiftStartX = e.touches[0].pageX;
    shiftStartY = e.touches[0].pageY;
    // console.log(shiftStartY);
  },

  touchMove: function (e) {
    // console.log(x);
    var shiftx = e.touches[0].pageX - shiftStartX;
    var shifty = e.touches[0].pageY - shiftStartY;

    var thY = wx.getSystemInfoSync().windowHeight;
    if (shiftStartY < thY && Math.abs(shiftx) > 1.1 * Math.abs(shifty)) {
      this.setData({
        shiftx: shiftx
      })
    }
  },

  touchEnd: function (e) {
    var shiftx = e.changedTouches[0].pageX - shiftStartX;
    var shifty = e.changedTouches[0].pageY - shiftStartY;
    var thX = (wx.getSystemInfoSync().windowWidth) / 15;
    var thY = wx.getSystemInfoSync().windowHeight;
    if (shiftStartY < thY && Math.abs(shiftx) > 1.1 * Math.abs(shifty)) {
      if (shiftx > thX) {
        // shift right;
        wx.navigateBack({
          delta: 1
        });
      }
    }

    shiftStartX = -1;
    shiftStartY = -1;
    this.setData({
      shiftx: 0
    })
  },

  debug: function () {
    var query = wx.createSelectorQuery();
    query.select('#scroll-day').boundingClientRect();
    var self = this;
    query.exec(function (res) {
      var h = res[0].height;
      var hblock = h / 5;
      self.setData({
        debug: "current hblock is "+hblock + ""+ (new Date())
      })
    });

  },

  onScrollEnd: function(e) {
    if (this.data.curYear != e.detail.year || this.data.curMonth != e.detail.month) {
      this.data.curYear = e.detail.year;
      this.data.curMonth = e.detail.month;

      console.log("month changed, should change the previous page params");
      var pages = getCurrentPages();
      var prePage = pages[pages.length - 2];
      prePage.refreshMonthSwiper(this.data.curYear, this.data.curMonth);
    }
  },

  clickBack: function(e) {
    wx.navigateBack({
      
    });
  }
})