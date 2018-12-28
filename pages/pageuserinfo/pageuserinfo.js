// pages/pageregister/pageregister.js

var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');

var today = util.formatTime(new Date());
today = today.substr(0,10);
console.log(today);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    title: "",
    today: today,
    genderArray: ["男","女"],
    genderIndex: 0,
    timeValue: "",
    time: "请选择",
    mobile: "",
    showMobile: true,
    styleTime: "placeholder",
    validate: {
      gender: true,
      birthCity: true,
      birthDate: false,
      birthTime: false,
      mobile: true
    },
    disableBtn: true,
    loadingBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.type == "register") {
      this.setData({
        type: "register",
        title: "填写资料"
      });
    } else {
      
      this.setData({
        type: options.type,
        title: "个人信息"
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    calCommonService.getMainUserInfo(function (userinfo) {
      self.initForm(userinfo);
    });

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

  initForm: function(userinfo) {
    this.data.userinfo = userinfo;
    if (userinfo.gender && userinfo.gender == "F") {
      this.data.genderIndex = 1;
    } else {
      this.data.genderIndex = 0;
    }
    this.data.gender = this.data.genderArray[this.data.genderIndex];

    this.setData(this.data);

    if (userinfo.birthProvince && userinfo.birthCity && userinfo.birthArea) {
      var comPlace = this.selectComponent("#birthPlace");
      comPlace.updateByPlace({
        province: userinfo.birthProvince,
        city: userinfo.birthCity,
        area: userinfo.birthArea
      });
    }

    if (userinfo.birthTime && userinfo.birthTime.length>0) {
      var comDate = this.selectComponent("#birthDate");
      comDate.updateByDate(userinfo.birthTime);
      this.data.validate.birthDate = true;

      this.selectTime(userinfo.birthTime.substr(11,5));
    }

    if (userinfo.mobile && userinfo.mobile.length == 11) {
      this.setData({
        mobile: userinfo.mobile
      })
    } else if (this.data.type == "readonly") {
      this.setData({
        showMobile: false
      })
    }
    this.checkValidate();
  },

  selectTime: function (time) {
    var strs = time.split(":");
    this.data.validate.birthTime = true;

    this.setData({
      timeValue: time,
      time: strs[0] + "时" + strs[1] + "分",
      styleTime: ""
    });

  },

  onSelectGender: function(e) {
    console.log(e);
    this.data.gender = this.data.genderArray[e.detail.value];
    this.setData({
      genderIndex: e.detail.value
    });
  },

  onSelectPlace: function(e) {
    // console.log(e);
  },

  onSelectDate: function (e) {
    // console.log(e);
    this.data.validate.birthDate = true;
    this.checkValidate();
  },

  onSelectTime: function(e) {
    var strTime = e.detail.value;
    var strs = strTime.split(":");
    this.data.validate.birthTime = true;

    this.setData({
      time: strs[0]+"时"+strs[1]+"分",
      styleTime: ""
    });
    this.checkValidate();
  },

  onInputMobile: function(e) {
    // console.log(e);
    var mobile = e.detail.value;
    if (!mobile || mobile.length == 0 || util.isMobile(mobile)) {
      this.data.validate.mobile = true;
    } else {
      this.data.validate.mobile = false;
    }
    this.checkValidate();
  },

  checkValidate: function() {
    var isValid = true;
    for (var key in this.data.validate) {
      if (!this.data.validate[key]) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      this.setData({
        disableBtn: false
      });
    } else {
      this.setData({
        disableBtn: true
      });
    }
  },

  saveUserinfo: function(userinfo, fCallback) {

    var self = this;
    var f = function (userinfo) {
      self.data.userinfo = userinfo;
      if (typeof(fCallback) == "function") {
        fCallback(userinfo);
      }
    }

    if (this.data.userinfo && this.data.userinfo.id) {
      userinfo.infoId = this.data.userinfo.id;
      calCommonService.updateUserInfo(userinfo, function (data) {
        // console.log(data);
        f(data);
      })
    } else {
      userinfo.type = "MAIN";
      calCommonService.createUserInfo(userinfo, function (data) {
        // console.log(data);
        f(data);
      })
    }
  },

  wxPay:function(data, fCallback) {
    var self = this;
    // wx.redirectTo({
    //   url: '../pageintro/pageintro?from=initial',
    // });
    // return;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        // console.log(res);
        calCommonService.succeedOrder(data.orderId, function () {
        });

        var f = function() {
          wx.showToast({
            title: '支付成功，感谢使用雷历',
          })
          if (typeof (fCallback) == "function") {
            fCallback();
          }
          wx.setStorageSync(calCommonService.genCurUserinfoKey(), self.data.userinfo);
          wx.redirectTo({
            url: '../pageintro/pageintro?from=register'
          })
        }

        setTimeout(f, 200);
      },
      fail: function(res) {
        console.log(res);
        if (typeof (fCallback) == "function") {
          fCallback();
        }
      }
    })
  },

  submitForm: function(e) {
    // console.log(e);
    var value = e.detail.value;
    var userinfo = {
      gender: (value.gender==0? "M":"F"),
      birthProvince: value.birthPlace.province.fullname,
      birthCity: value.birthPlace.city.fullname,
      birthArea: value.birthPlace.area.fullname,
      birthLongitude: parseInt(value.birthPlace.area.location.lng * 100000),
      birthLatitude: parseInt(value.birthPlace.area.location.lat * 100000),
      birthTime: value.birthDate+" "+value.birthTime+":00"
    }
    if (value.mobile.length > 0) {
      userinfo.mobile = value.mobile;
    }
    this.setData({
      loadingBtn: true,
      disableBtn: true
    })
    var self = this;
    this.saveUserinfo(userinfo, function (userinfo) {
      calCommonService.unifiedOrder(userinfo.id, function(data) {
        // console.log(data);
        self.wxPay(data, function() {
          self.setData({
            loadingBtn: false,
            disableBtn: false
          })
        });
      })
      
    })


  }

})