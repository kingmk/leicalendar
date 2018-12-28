// pages/pageyear/pageyear.js


var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');
var d = new Date();
var curYear = d.getFullYear();
var years = util.years;
var current = 0;
for (var i=0; i< years.length; i++) {
  if (years[i] == curYear){
    current = i;
    break;
  }
}


var shiftStartX = -1;
var shiftStartY = -1;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    years: util.years,
    current: current,
    imgBg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var year = options.year;
    calCommonService.loadSolarInfo(year, function(solarList) {
      var d = new Date();
      var dstr = util.formatTime(d);
      console.log(dstr);
      var solarName = "";
      var i =0;
      for (i=0; i<solarList.length; i++) {
        var tmp = solarList[i];
        if (dstr >= tmp.time) {
          solarName = tmp.name;
        }
      }
      if (solarName == "") {
        if (year > 2019) {
          solarName = "冬至";
        } else {
          solarName = "小寒";
        }
      }
      console.log("solarName:"+solarName);
      var imgUrl = util.getSolarImages(solarName);
      console.log("imgUrl:" + imgUrl);
      if(imgUrl && imgUrl.length>0) {
        self.setData({
          imgBg: imgUrl
        })
      }
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

  selectYearMonth: function(e) {
    var selYear = e.detail.year;
    var selMonth = e.detail.month;
    // wx.navigateTo({
    //   url: '../pagemonth/pagemonth?year='+selYear+"&month="+selMonth,
    // })
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    prePage.refreshMonthSwiper(selYear, selMonth);
    wx.navigateBack({
      delta: 1
    });
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
    var winW = wx.getSystemInfoSync().windowWidth;
    var rpx = winW / 750;
    var thY = wx.getSystemInfoSync().windowHeight - (this.data.infoShown ? 620 * rpx : 180 * rpx);
    console.log("startY: " + shiftStartY + ", thY: " + thY);
    if (shiftStartY < thY && Math.abs(shiftx) > 1.1 * Math.abs(shifty)) {
      this.setData({
        shiftx: shiftx
      })
    }
  },

  touchEnd: function (e) {
    console.log(e);
    var shiftx = e.changedTouches[0].pageX - shiftStartX;
    var shifty = e.changedTouches[0].pageY - shiftStartY;
    var winW = wx.getSystemInfoSync().windowWidth;
    var rpx = winW / 750;
    var thX = winW / 15;
    var thY = wx.getSystemInfoSync().windowHeight - (this.data.infoShown ? 620 * rpx : 180 * rpx);
    if (shiftStartY < thY && Math.abs(shiftx) > 1.1 * Math.abs(shifty)) {
      if (shiftx < -thX) {
        // shift left;
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
  }
})