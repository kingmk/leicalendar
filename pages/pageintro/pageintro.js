// pages/pageintro/pageintro.js

var util = require('../../utils/util.js');

var introImages = ["http://cdnstatic.leimenyi.com.cn/filedata0/static/intro1.gif", "http://cdnstatic.leimenyi.com.cn/filedata0/static/intro2.gif", "http://cdnstatic.leimenyi.com.cn/filedata0/static/intro3.gif"];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasBack: false,
    hasSkip: false,
    selectIntro: ["selected", "unselected", "unselected"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from == "register") {
      this.setData({
        hasBack: false,
        hasSkip: true
      });
    } else {
      this.setData({
        hasBack: true,
        hasSkip: false
      });
    }
    this.loadImage(0);
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

  loadImage: function(idx) {
    wx.showLoading({
      title: '演示加载中',
    })
    this.setData({
      introImage: introImages[idx],
      introIdx: idx
    })
  },

  onLoadIntro: function(e) {
    console.log(e);
    wx.hideLoading();
  },

  clickMenu: function(e) {
    // console.log(e);
    
    var introid = parseInt(e.currentTarget.dataset.introid);

    if (introid == this.data.introIdx) {
      return;
    }

    var selectIntro = ["unselected", "unselected", "unselected"];
    selectIntro[introid] = "selected";
    this.setData({
      selectIntro: selectIntro
    });

    this.loadImage(introid);
  },

  goCalendar: function() {

    var d = new Date();
    var curYear = d.getFullYear();
    var curMonth = d.getMonth() + 1;
    var years = util.years;
    if (curYear < years[0]) {
      curYear = years[0];
      curMonth = 1;
    }

    wx.redirectTo({
      url: '../pagemonth/pagemonth?year=' + curYear + "&month=" + curMonth,
    })
  }
})