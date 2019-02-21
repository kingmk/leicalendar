// pages/pagemonth/pagemonth.js

var util = require('../../utils/util.js');
var shiftStartX = -1;
var shiftStartY = -1;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideInfo: "hidden",
    shiftx: 0,
    btnShow: "",
    // specialImg: "../../static/images/special_demo.jpeg",
    animationsp: "",
    specialL: 0,
    specialT: 0,
    specialX: 0,
    specialY: 0,
    infoShown: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curmonthInfos = util.monthInfos;
    var today = new Date();

    this.data.curmonth = parseInt(options.month);;
    this.data.curyear = parseInt(options.year);
    if (this.data.curyear == today.getFullYear() && this.data.curmonth == today.getMonth() + 1) {
      this.data.btnShow = "hide";
    }
    
    this.setData({
      curyear: this.data.curyear,
      curmonth: this.data.curmonth,
      curmonthInfo: curmonthInfos[this.data.curmonth-1],
      btnShow: this.data.btnShow
    });
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
  onShareAppMessage: function (res) {
    console.log(res);

    return util.shareProp;
  },

  showBtnToday: function(date) {
    
    if (util.isToday(date)) {
      this.data.btnShow = "hide";
    } else {
      this.data.btnShow = "";
    }
    this.setData({
      btnShow: this.data.btnShow
    })
  },

  clickToday: function() {
    var today = new Date();
    var curyear = today.getFullYear();
    var curmonth = today.getMonth()+1;
    if (today.getFullYear() < util.years[0]) {
      curyear = util.years[0];
      curmonth = 1;
    }


    var viewTag = this.selectComponent("#view-tag");
    viewTag.reset();
    var swiperMonth = this.selectComponent("#swiper-month");
    swiperMonth.data.tagIdx = -1;
    if (curyear != this.data.curyear || curmonth != this.data.curmonth) {
      var neighborData = util.getNeighborMonthes(curyear, curmonth);
      swiperMonth.changeMonthData(neighborData);
    } else {
      swiperMonth.selectToday();
    }
    // var neighborData = util.getNeighborMonthes(curyear, curmonth);
    // swiperMonth.changeMonthData(neighborData);
    this.refreshMonthData(curyear, curmonth);
  },

  refreshMonthData: function (year, month) {
    console.log("refresh month: " + year + "-" + month);
    var today = new Date();
    if (year == today.getFullYear() && month == today.getMonth() + 1) {
      this.data.btnShow = "hide";
    } else {
      this.data.btnShow = "";
    }
    this.setData({
      curyear: year,
      curmonth: month,
      curmonthInfo: util.monthInfos[month - 1],
      btnShow: this.data.btnShow
    });

  },

  refreshMonthSwiper: function(year, month) {
    var neighborData = util.getNeighborMonthes(year, month);
    var swiperMonth = this.selectComponent("#swiper-month");
    swiperMonth.changeMonthData(neighborData);
    this.refreshMonthData(year, month);
  },

  onSwipeMonth: function(e) {
    var year = e.detail.year;
    var month = e.detail.month; 
    this.refreshMonthData(year, month);
    this.data.infoShown = false;
  }, 

  onShowTag: function(e) {
    var tagIdx = e.detail.tagidx;

    var swiperMonth = this.selectComponent("#swiper-month");
    swiperMonth.showTag(tagIdx);
    this.setData({
      btnShow: "",
      infoShown: false
    })
  },

  onClickDate: function(e) {
    var dateinfo = e.detail.dateinfo;
    var dateClick = new Date(dateinfo.date.replace(/-/g,"/"));
    this.showBtnToday(dateClick);
    var viewTag = this.selectComponent("#view-tag");
    viewTag.reset();
    this.data.infoShown = true;
  },

  onClickInfo: function(e) {
    var dateinfo = e.detail.dateinfo;
    var d = new Date(dateinfo.date.replace(/-/g, "/"));

    wx.navigateTo({
      url: '../pageday/pageday?year='+d.getFullYear()+"&month="+(d.getMonth()+1)+"&day="+(d.getDate())
    })
  },

  goAccount:function(e) {
    wx.navigateTo({
      url: '../pageaccount/pageaccount',
    })
  }

})