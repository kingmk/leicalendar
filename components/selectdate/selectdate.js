// components/selecttime/selecttime.js

var util = require('../../utils/util.js');

var now = new Date();
var curYear = now.getFullYear();
var curMonth = now.getMonth() + 1;
var curDate = now.getDate();
var years = new Array();
var startYear = 1948;
var startMonth = 2;
var startDay = 5;
for (var year = startYear; year <= curYear; year++) {
  years.push(year);
}
var monthes = new Array();
for (var i = 1; i <= 12; i++) {
  monthes.push(i);
}
var days = new Array();
for (var i = 1; i <= 31; i++) {
  days.push(i);
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
    dateArray: null,
    dateIndex: null,
    selectDate: "请选择",
    style: "placeholder"
  },

  ready: function() {
    this.updateSelect([(2000 - startYear), 0, 0]);
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateByDate: function(strDate) {
      var strDate = strDate.substr(0,10);
      var ss = strDate.split("-");
      var v = [parseInt(ss[0])-startYear, parseInt(ss[1])-1, parseInt(ss[2])-1];

      var self = this;
      var timer = setInterval(function () {
        if (self.data.dateArray != null) {
          self.updateSelect(v);
          self.selectDate(v);
          clearInterval(timer);
        }
      }, 200);
    },

    updateSelect: function (value) {
      var year = years[value[0]];
      var month = monthes[value[1]];
      var day = days[value[2]];
      monthes = new Array();
      days = new Array();

      if (year == startYear) {
        for (var i = 2; i <=12; i++) {
          monthes.push(i);
        }
      } else if (year == curYear) {
        for (var i = 1; i <= curMonth; i++) {
          monthes.push(i);
        }
      } else {
        for (var i = 1; i <= 12; i++) {
          monthes.push(i);
        }
      }
      var monthIdx = Math.min(Math.max(0, month-monthes[0]), monthes.length-1);
      month = monthes[monthIdx];
      value[1] = monthIdx;
      
      var daysInMonth = (new Date(year, month, 0)).getDate();
      if (year == startYear && month == startMonth) {
        for (var i = startDay; i<=daysInMonth; i++) {
          days.push(i);
        }
      } else {
        for (var i = 1; i <= daysInMonth; i++) {
          days.push(i);
        }
      }
      var dayIdx = Math.min(Math.max(0, day - days[0]), days.length-1);
      day = days[dayIdx];
      value[2] = dayIdx;

      this.data.dateIndex = value;
      this.data.dateArray = [years, monthes, days];
      this.setData({
        dateArray: this.data.dateArray,
        dateIndex: this.data.dateIndex
      })
    },

    selectDate: function (v) {
      this.data.dateIndex = v;
      var dateArray = this.data.dateArray;
      var d = new Date(dateArray[0][v[0]], dateArray[1][v[1]]-1, dateArray[2][v[2]], 0, 0);
      var strd = util.formatTime(d).substr(0, 10);
      this.setData({
        value: strd,
        selectDate: strd,
        style: ""
      })
      this.triggerEvent("selectDate", {selectDate: d});
    },

    onSelectChange: function (e) {
      this.selectDate(e.detail.value);
    },

    onColumnChange: function (e) {
      // console.log(e.detail.column);
      // console.log(e.detail.value);
      var column = e.detail.column;
      var value = e.detail.value;
      var curValue = this.data.dateIndex;
      curValue[column] = value;
      this.updateSelect(curValue);
    }
  }
})
