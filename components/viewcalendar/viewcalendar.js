// components/viewcalendar/viewcalendar.js

var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
var bgstyle = ["bg-darkred", "bg-bloodorange", "bg-orange", "bg-yelloworange", "bg-yellow"];
var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    year : {
      type: Number,
      value: 0
    },
    month: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekdays: weekdays,
    daterows: [],
    animationInfo: "",
    showInfo: false,
    currentInfo: 0
  },

  ready: function() {
    this.initCalendar(this.data.year, this.data.month);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initCalendar: function (year, month) {
      var self = this;
      self.initCalendarCtrl(year, month);
      calCommonService.loadMonthInfo(year, month, function (dateInfos) {
        self.initDateInfos(dateInfos);
      })

    },

    initCalendarCtrl: function (year, month) {
      var strDate = [year, month, 1].map(util.formatNumber).join("/") + " 00:00";
      var date = new Date(strDate);
      var weekday0 = date.getDay();
      var dates = new Array();
      // fill the empty position in the first row of calendar
      for (var i = 0; i < weekday0; i++) {
        // get an empty date for the nonexistant date
        dates.push(this.wrapDateInfo(null));
      }
      for (var i = 0; i < 31; i++) {
        date.setDate(i + 1);
        if (date.getMonth() + 1 != month) {
          break;
        }
        var item = {
          day: util.formatNumber(i+1),
          stiny: "",
          style: ""
        };
        dates.push(item);
      }
      var j = (dates.length - 1) % 7;
      // fill the empty position in the last row of calendar
      for (var i = j + 1; i <= 6; i++) {
        dates.push(this.wrapDateInfo(null));
      }
      var rows = new Array();
      var row = null;

      for (var i = 0; i < dates.length; i++) {
        if (i % 7 == 0) {
          if (row != null) {
            rows.push(row);
          }
          row = new Array();
        }
        row.push(dates[i]);
      }
      rows.push(row);

      this.setData({
        year: year,
        month: month,
        daterows: rows
      });
    },

    initDateInfos: function (dateInfos) {
      var info = null;
      var animationInfo = null;
      var rows = this.data.daterows;
      var idxInfo = 0;
      var showInfo = false;
      for (var i =0; i<rows.length; i++ ){
        var row = rows[i];
        for (var j=0; j<row.length; j++) {
          var item = row[j];
          if (!item.day || item.day.length == 0) {
            continue;
          }

          if (dateInfos && dateInfos[idxInfo]) {
            item = this.wrapDateInfo(dateInfos[idxInfo]);
            if (item.curday) {
              item.style = "selected";
              animationInfo = this.getInfoAnimation(true);
              info = this.getInfoFromService(this.data.year, this.data.month, parseInt(item.day));
              showInfo = true;
            }
            row[j] = item;
            idxInfo++;
          }
        }
      }

      this.setData({
        daterows: this.data.daterows,
        info: info,
        showInfo: showInfo
      });
      if (showInfo) {
        var self = this;
        var f = function () {
          self.setData({
            animationInfo: self.getInfoAnimation(true)
          });
        }
        setTimeout(f, 100);
      }
    },

    wrapDateInfo: function(dateInfo) {
      if (dateInfo) {
        dateInfo.day = util.formatNumber(dateInfo.date.substr(8,2));
        var style = "";
        if (util.isToday(new Date(dateInfo.date.replace(/-/g,"/")))) {
          // style = "curday";
          dateInfo.curday = true;
        }
        dateInfo.style = style;
        dateInfo.specialDay = false;
        var stiny = dateInfo.lunarStr;
        if (dateInfo.solar && dateInfo.solar.length > 0) {
          stiny = dateInfo.solar;
          dateInfo.specialDay = true;
        } else if (dateInfo.holiday && dateInfo.holiday.length > 0) {
          stiny = dateInfo.holiday;
          dateInfo.specialDay = true;
        }
        dateInfo.stiny = stiny;
        return dateInfo
      } else {
        return {
          day: "",
          stiny: "",
          style: ""
        }
      }
    },

    selectToday: function() {
      var today = new Date();
      if (this.data.year != today.getFullYear() || this.data.month != (today.getMonth()+1)) {
        return;
      }
      var daterows = this.data.daterows;
      for (var i = 0; i < daterows.length; i++) {
        var daterow = daterows[i];
        for (var j = 0; j < daterow.length; j++) {
          var item = daterow[j];
          item.style = "";
          if (item.curday) {
            item.style = "selected";
          }
        }
      }
      var info = this.getInfoFromService(today.getFullYear(), (today.getMonth() + 1), today.getDate());
      this.setData({
        daterows: daterows,
        info: info,
        showInfo: true,
        currentInfo: 0
      });
      var self = this;
      var f = function () {
        self.setData({
          animationInfo: self.getInfoAnimation(true)
        });
      }
      setTimeout(f, 100);
    },

    clearSelect: function(isReset, isClearCurday) {
      var daterows = this.data.daterows;
      var info = null;
      var showInfo = false;
      var animationInfo = this.getInfoAnimation(false);
      for (var i = 0; i < daterows.length; i++) {
        var daterow = daterows[i];
        for (var j = 0; j < daterow.length; j++) {
          var item = daterow[j];
          item.style = "";
          if (item.curday) {
            info = this.getInfoFromService(this.data.year, this.data.month, parseInt(item.day));
            if (!isClearCurday) {
              showInfo = true;
              animationInfo = this.getInfoAnimation(true);
            }
          }
        }
      }
      if (isReset) {
        this.setData({
          daterows: this.data.daterows,
          showInfo: showInfo,
          info: info
        });
        if (showInfo) {
          var self = this;
          var f = function () {
            self.setData({
              animationInfo: animationInfo,
            });
          }
          setTimeout(f, 300);
        }
      }
    },

    clickDate: function (e) {
      var day = e.currentTarget.dataset.day;
      if (day.length == 0) {
        return;
      }

      var row = e.currentTarget.dataset.row;
      var col = e.currentTarget.dataset.col;
      this.clearSelect(false, true);
      var item = this.data.daterows[row][col];

      // if (!item.curday) {
      //   item.style = "selected";
      // }
      item.style = "selected";
      var info = this.getInfoFromService(this.data.year, this.data.month, parseInt(item.day));
      console.log(info);

      if (info) {
        this.setData({
          daterows: this.data.daterows,
          info: info,
          showInfo: true,
          currentInfo: 0
        });
        var self = this;
        var f = function() {
          self.setData({
            animationInfo: self.getInfoAnimation(true)
          });
        }
        setTimeout(f, 100);
      }
      this.triggerEvent("clickdate", { dateinfo: info });
    },

    getInfoFromService: function(year, month, day) {
      var info = calCommonService.getInfoByDate(year, month, day);

      if (info) {
        if (info.evtGoods && info.evtGoods.length <= 4) {
          info.evtGoodsStyle = "event-large";
        } else {
          info.evtGoodsStyle = "";
        }

        if (info.evtBads && info.evtBads.length <= 4) {
          info.evtBadsStyle = "event-large";
        } else {
          info.evtBadsStyle = "";
        }
      }
      if (info.extraInfo) {
        if (info.extraInfo.evtGoods && info.extraInfo.evtGoods.length <= 4) {
          info.extraInfo.evtGoodsStyle = "event-large";
        } else {
          info.extraInfo.evtGoodsStyle = "";
        }

        if (info.extraInfo.evtBads && info.extraInfo.evtBads.length <= 4) {
          info.extraInfo.evtBadsStyle = "event-large";
        } else {
          info.extraInfo.evtBadsStyle = "";
        }
      }
      return info;
    },

    getInfoAnimation: function(isShow) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      });
      animation.opacity(isShow?1:0).step();
      return animation.export();
    },

    showTag: function (tagIdx) {
      console.log(tagIdx);
      var tagKey = "A" + util.formatNumber(tagIdx);
      var daterows = this.data.daterows;
      for (var i= 0; i<daterows.length; i++) {
        var daterow = daterows[i];
        for (var j=0; j<daterow.length; j++) {
          var dateInfo = daterow[j];
          if (dateInfo.day == "") {
            continue;
          }
          if (tagIdx == -1) {
            dateInfo.style = "";
          } else if (dateInfo.events && dateInfo.events[tagKey] && dateInfo.events[tagKey] == 1) {
            var style = "";
            if (tagIdx < 4) {
              style = bgstyle[tagIdx];
            } else {
              style = bgstyle[4];
            }
            dateInfo.style = style;
          } else {
            style = "";
          }
        }
      }

      this.setData({
        daterows: daterows
      });
    },

    onClickInfo: function() {
      this.triggerEvent("clickinfo", { dateinfo: this.data.info });
    }
  }
})
