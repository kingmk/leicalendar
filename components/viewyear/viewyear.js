// components/viewyear/viewyear.js

var util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    year: {
      type: String,
      value: ""
    },
    month: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    monthInfos: util.monthInfos
  },

  ready: function () {
    var now = new Date();
    var curYear = now.getFullYear();
    var curMonth = now.getMonth();
    if (this.data.year == curYear) {
      var monthInfos = this.data.monthInfos;
      monthInfos[curMonth].selectclass = "selected";
      this.setData({ monthInfos: monthInfos });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMonth: function (e) {
      var month = e.currentTarget.dataset.month;
      this.triggerEvent("selmonth", { year: this.data.year, month: month + 1 });
    }
  }
})
