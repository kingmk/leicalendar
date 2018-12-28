// components/titlebar/titlebar.js

var util = require('../../utils/util.js');
var info = wx.getSystemInfoSync();
var h = info.statusBarHeight;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    hasBack: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarH: h,
    showBack: false
  },

  ready: function() {
    if (!this.data.hasBack) {
      this.setData({
        showBack: false
      });
      return;
    }
    var pages = getCurrentPages();
    if (pages.length <= 1) {
      this.setData({
        showBack: false
      })
    } else {
      this.setData({
        showBack: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickBack: function() {
      wx.navigateBack({
        
      })
    }
  }
})
