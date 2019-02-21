//index.js
//获取应用实例

var calCommonService = require('../../service/calCommonService.js');
var util = require('../../utils/util.js');


var shiftStartX = -1;
var shiftStartY = -1;

var posAboveFrames = [
  { w: 620, h: 620, l: -273, t: -322, z: 100, a: true },
  { w: 582, h: 582, l: -171, t: -314, z: 100, a: false },
  { w: 525, h: 525, l: -101, t: -318, z: 100, a: false },
  { w: 466, h: 466, l: -40, t: -328, z: 100, a: false },
  { w: 459, h: 459, l: -28, t: -356, z: 90, a: false },
  { w: 404, h: 404, l: -19, t: -387, z: 90, a: false },
  { w: 362, h: 362, l: -32, t: -404, z: 90, a: false }
];

var posBelowFrames = [
  { w: 362, h: 362, l: -32, t: -404, z: 90, a: false },
  { w: 391, h: 391, l: -124, t: -416, z: 90, a: false },
  { w: 409, h: 409, l: -227, t: -403, z: 90, a: false },
  { w: 439, h: 439, l: -327, t: -385, z: 90, a: false },
  { w: 459, h: 459, l: -383, t: -356, z: 100, a: false },
  { w: 510, h: 510, l: -333, t: -336, z: 100, a: false },
  { w: 620, h: 620, l: -273, t: -322, z: 100, a: true }
]

const app = getApp()

var specialDay = util.isSpecialDay(new Date());
// specialDay.img = "http://cdnstatic.leimenyi.com.cn/filedata0/static/specialdays/20190208_lichun.jpg";
console.log(specialDay);

Page({
  data: {
    curState: 0, // 0: red above, 1: blue above
    posRed: posAboveFrames[0],
    posBlue: posBelowFrames[0],
    timer: 0,
    isSwitching: false,
    specialDay: specialDay,
    counting: 3,
    timerInit: 0,
    animationInit: "",
    showCounting: "hide",
    hasTapStart: false
  },
  //事件处理函数
  onLoad: function () {

    // qqmapsdk = new QQMapWX({
    //   key: "3VOBZ-ND3WU-SXUVU-4BTBM-6JCQV-BFFVO"
    // });

    // qqmapsdk.getCityList({
    //   success: function (res) {
    //     console.log("###qqmap: success: "+JSON.stringify(res));
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log("###qqmap: fail");
    //     console.log(res);
    //   }
    // })

    // qqmapsdk.geocoder({
    //   address: "浙江省杭州市西湖区",
    //   success: function(res) {
    //     console.log("###qqmap: success");
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log("###qqmap: fail");
    //     console.log(res);
    //   }
    // })
    // wx.showLoading({
    //   title: '加载中',
    // })
  },

  coverLoaded: function () {
    // wx.hideLoading();
    if (specialDay) {
      var self = this;
      self.setData({
        showCounting: ""
      })
      var f = function () {
        self.data.counting--;
        self.setData({
          counting: self.data.counting
        })
        if (self.data.counting == 0) {
          self.skipCover();
        }
      };

      self.data.timerInit = setInterval(function () {
        f();
      }, 1000);
    }

  },

  skipCover: function() {
    var self = this;
    clearInterval(self.data.timerInit);
    // return;
    var animation = wx.createAnimation({
      duration: 1200,
      timingFunction: 'linear',
    });
    animation.opacity(0).step();
    self.setData({
      animationInit: animation.export()
    });
    setTimeout(function () {
      self.setData({
        specialDay: null
      })
    }, 1200);
  },

  switchCalendar: function() {
    var self = this;
    var idx = 0;
    var fFrame = function (idx) {
      var posAbove = posAboveFrames[idx];
      var posBelow = posBelowFrames[idx];
      if (self.data.curState == 0) {
        self.setData({
          posRed: posAbove,
          posBlue: posBelow
        });

      } else {
        self.setData({
          posRed: posBelow,
          posBlue: posAbove
        });

      }
    }
    self.data.isSwitching = true;
    self.data.timer = setInterval(function() {
      idx++;
      fFrame(idx);
      if (idx == 6) {
        clearInterval(self.data.timer);
        self.setData({
          isSwitching: false,
          curState: 1-self.data.curState
        })

      }
    }, 80);

  },

  tapStart: function() {
    if (this.data.hasTapStart) {
      return;
    }

    var d = new Date();
    var curYear = d.getFullYear();
    var curMonth = d.getMonth()+1;
    var years = util.years;
    if (curYear < years[0]) {
      curYear = years[0];
      curMonth = 1;
    }
    this.data.hasTapStart = true;
    wx.showLoading({
      title: '正在翻开您的雷历',
    })
    calCommonService.getMainUserInfo(function (userinfo) {
      if (userinfo && userinfo.status == "01") {
        wx.setStorageSync(calCommonService.genCurUserinfoKey(), userinfo);
        wx.redirectTo({
          url: '../pagemonth/pagemonth?year=' + curYear + "&month=" + curMonth,
        })
      } else {
        wx.redirectTo({
          url: '../pageuserinfo/pageuserinfo?type=register',
        })
      }
    }, function() {
      this.data.hasTapStart = false;
    });
  },

  // touchStart: function (e) {
  //   shiftStartX = e.touches[0].pageX;
  //   shiftStartY = e.touches[0].pageY;
  // },

  // touchMove: function (e) {
  //   // console.log(x);
  // },

  // touchEnd: function (e) {
  //   // console.log(e);
  //   var dx = e.changedTouches[0].pageX - shiftStartX;
  //   var dy = -(e.changedTouches[0].pageY - shiftStartY);

  //   if (dx < 0 || Math.abs(dx) < 10) {
  //     return;
  //   }

  //   if (dy/dx <= 1.732 && dy/dx >= -0.5774) {
  //     if (!this.data.isSwitching) {
  //       this.switchCalendar();
  //     }
  //   }
  // }
})
