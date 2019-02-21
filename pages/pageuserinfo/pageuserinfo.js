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
    smsCode: "",
    showMobile: true,
    validate: {
      gender: true,
      birthCity: false,
      birthDate: false,
      birthTime: false,
      mobile: false,
      smsCode: false
    },
    disableBtn: true,
    loadingBtn: false,
    smsText: "获取",
    showAgreeMask: false,
    checksrc: "/static/images/icon_check0.png",
    checkstatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.type == "register") {
      this.setData({
        type: "register",
        title: "填写资料",
        showAgreeMask: true
      });
    } else if (options.type == "readonly") {
      this.setData({
        type: "readonly",
        title: "个人信息"
      });
    } else {
      this.setData({
        type: "waiting",
        title: "个人信息"
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    wx.showLoading({
      title: '正在加载',
    })
    calCommonService.getMainUserInfo(function (userinfo) {
      wx.hideLoading();
      if (userinfo !=null && self.data.type == "waiting") {
        if (userinfo.countUpdate >= 1) {
          self.setData({
            type: "updatem"
          });
        } else {
          self.setData({
            type: "update"
          })
        }
      }

      self.initForm(userinfo);
      // if (self.data.type == "update") {
      //   wx.showLoading({
      //     title: '测试',
      //   })
      // }
    }, function() {
      wx.hideLoading();
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
    return util.shareProp;
  },

  initForm: function(userinfo) {
    if(userinfo == null) {
      return;
    }
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
      this.data.validate.birthCity = true;
    }

    if (userinfo.birthTime && userinfo.birthTime.length>0) {
      var comDate = this.selectComponent("#birthDate");
      comDate.updateByDate(userinfo.birthTime);
      this.data.validate.birthDate = true;

      var comTime = this.selectComponent("#birthTime");
      comTime.updateByTime(userinfo.birthTime);
      this.data.validate.birthTime = true;
    }

    if (userinfo.mobile && userinfo.mobile.length == 11) {
      this.setData({
        mobile: userinfo.mobile
      })
      this.data.validate.mobile = true;
    } else if (this.data.type == "readonly") {
      this.setData({
        showMobile: false
      })
    }

    this.setData({
      smsCode: "",
      smsText: "获取"
    })
    clearInterval(this.data.timer);
    this.checkValidate();
  },

  selectTime: function (time) {
    var strs = time.split(":");
    this.data.validate.birthTime = true;

    this.setData({
      timeValue: time,
      time: strs[0] + "时" + strs[1] + "分",
      // styleTime: ""
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
    this.data.validate.birthCity = true;
    this.checkValidate();
  },

  onSelectDate: function (e) {
    // console.log(e);
    this.data.validate.birthDate = true;
    this.checkValidate();
  },

  onSelectTime: function(e) {
    console.log(e);
    this.data.validate.birthTime = true;
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
    this.data.mobile = mobile;
    this.checkValidate();
  },

  onInputCode: function (e) {
    var smsCode = e.detail.value;
    if (smsCode != null && smsCode.length == 6 ) {
      this.data.validate.smsCode = true;
    } else {
      this.data.validate.smsCode = false;
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

  fetchSmsCode: function() {
    if (this.data.smsText != "获取"){
      return;
    }
    if (this.data.type == "register" && !this.data.checkstatus) {
      wx.showModal({
        title: '提示',
        content: '请阅读并同意用户服务及隐私协议',
        showCancel: false
      })
      return;
    }
    if (!util.isMobile(this.data.mobile)) {
      wx.showModal({
        title: '错误提示',
        content: '请输入正确的手机号后再获取验证码',
        showCancel: false
      });
      return;
    }

    var self = this;
    var type = "register";
    var userinfoId = null;
    if ( self.data.type == "update" || self.data.type == "updatem") {
      type = "update";
      userinfoId = self.data.userinfo.id;
    }


    calCommonService.fetchSmsCode(this.data.mobile, userinfoId, type, function() {
      wx.showToast({
        title: '验证码已发送',
      });
      self.data.smsCount = 90;
      self.setData({
        smsText: "" + self.data.smsCount + "s"
      })
      var f = function () {
        if (self.data.smsCount == 0) {
          self.setData({
            smsText: "获取"
          })
          clearInterval(self.data.timer);
        } else {
          self.data.smsCount = self.data.smsCount - 1;
          self.setData({
            smsText: "" + self.data.smsCount + "s"
          });
        }
      }

      self.data.timer = setInterval(f, 1000);
    });
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
      }, function () {
        self.setData({
          loadingBtn: false,
          disableBtn: false
        });
      })
    } else {
      userinfo.type = "MAIN";
      calCommonService.createUserInfo(userinfo, function (data) {
        // console.log(data);
        f(data);
      }, function() {
        self.setData({
          loadingBtn: false,
          disableBtn: false
        });
      })
    }
  },


  submitForm: function(e) {
    // console.log(e);
    if (this.data.type == "readonly") {
      return;
    }

    if (this.data.type == "register" && !this.data.checkstatus) {
      wx.showModal({
        title: '提示',
        content: '请阅读并同意用户服务及隐私协议',
        showCancel: false
      })
      return;
    }

    var value = e.detail.value;
    var userinfo = {
      gender: (value.gender==0? "M":"F"),
      birthProvince: value.birthPlace.province.fullname,
      birthCity: value.birthPlace.city.fullname,
      birthArea: value.birthPlace.area.fullname,
      birthLongitude: parseInt(value.birthPlace.area.location.lng * 100000),
      birthLatitude: parseInt(value.birthPlace.area.location.lat * 100000),
      birthTime: value.birthDate+" "+value.birthTime+":00",
      mobile: value.mobile,
      smsCode: value.smsCode
    }
    // if (value.mobile.length > 0) {
    //   userinfo.mobile = value.mobile;
    // }
    this.setData({
      loadingBtn: true,
      disableBtn: true
    })
    var self = this;
    this.saveUserinfo(userinfo, function (userinfo) {
      // calCommonService.unifiedOrder(userinfo.id, function(data) {
      //   // console.log(data);
      //   self.wxPay(data, function() {
      //   });
      // })

      wx.setStorageSync(calCommonService.genCurUserinfoKey(), self.data.userinfo);
      if (self.data.type == "register") {
        wx.redirectTo({
          url: '../pageintro/pageintro?from=register'
        })
      } else if(self.data.type == "update") {
        wx.clearStorageSync();
        wx.showToast({
          title: '保存成功',
        })
        wx.redirectTo({
          url: '../index/index?from=update'
        })
      } else if (self.data.type == "updatem") {
        wx.showToast({
          title: '保存成功',
        })
        self.setData({
          type: "updatem"
        });
        self.initForm(self.data.userinfo);
      }
      self.setData({
        loadingBtn: false,
        disableBtn: false
      });
    })


  },

  clickDisagreeMask: function (e) {
    this.setData({
      checksrc: "/static/images/icon_check0.png",
      checkstatus: false,
      showAgreeMask: false
    })
  },

  clickAgreeMask: function (e) {
    this.setData({
      checksrc: "/static/images/icon_check1.png",
      checkstatus: true,
      showAgreeMask: false
    })
  },

  clickLink: function (e) {
    wx.navigateTo({
      url: '../pageagreement/pageagreement?from=register',
    })
  },

  clickCheckAgree: function(e) {
    if (!this.data.checkstatus) {
      this.setData({
        checksrc: "/static/images/icon_check1.png",
        checkstatus: true
      })
    } else {
      this.setData({
        checksrc: "/static/images/icon_check0.png",
        checkstatus: false
      })
    }
  },


  test: function(e) {
    // console.log("click test");
    wx.showToast({
      title: '测试',
    })
  }

})