// components/selecttime/selecttime.js
var util = require('../../utils/util.js');

var hours = new Array();
for (var i = 0; i <= 23; i++) {
  hours.push(i);
}
var minutes = new Array();
for (var i = 0; i <= 59; i++) {
  minutes.push(i);
}


Component({
  behaviors: ["wx://form-field"],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: "String",
      value: ""
    },
    disabled: {
      type: "Boolean",
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeArray: [hours, minutes],
    timeIndex: [0, 0],
    selectTime: "请选择",
    style: "placeholder"
  },

  ready: function () {
    this.updateSelect([0, 0]);

  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateByTime: function (strDate) {
      var strTime = strDate.substr(11,5);
      var ss = strTime.split(":");
      var v = [parseInt(ss[0]), parseInt(ss[1])];

      var self = this;
      var timer = setInterval(function () {
        if (self.data.timeArray != null) {
          self.updateSelect(v);
          self.selectTime(v);
          clearInterval(timer);
        }
      }, 200);
    },

    updateSelect: function (value) {

      this.setData({
        timeIndex: value
      })
    },

    selectTime: function (v) {
      this.data.timeIndex = v;
      var timeArray = this.data.timeArray;
      var strd = v.map(util.formatNumber).join(':');
      this.setData({
        value: strd,
        selectTime: ""+v[0]+"时"+v[1]+"分",
        style: ""
      })
      this.triggerEvent("selectTime", { selectTime: strd});
    },

    onSelectChange: function (e) {
      this.selectTime(e.detail.value);
    },
  }
})
