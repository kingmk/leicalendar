// components/scrollday/scrollday.js


var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');
var timer = -1;

var weekdays = [{ "cname": "周日", "ename": "Sun." }, { "cname": "周一", "ename": "Mon." }, { "cname": "周二", "ename": "Tue." }, { "cname": "周三", "ename": "Wed." }, { "cname": "周四", "ename": "Thur." }, { "cname": "周五", "ename": "Fri." }, { "cname": "周六", "ename": "Sat." }];

var iconmap = {"大凶":"icon_luck_worst.png", "小凶":"icon_luck_bad.png", "平":"icon_luck_even.png", "小吉":"icon_luck_good.png", "大吉":"icon_luck_best.png"};

var monthKeys = ["m201901", "m201902", "m201903", "m201904", "m201905", "m201906", "m201907", "m201908", "m201909", "m201910", "m201911", "m201912"];


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    monthKeys: monthKeys,
    monthDayInfos: {},
    dayInfoCount: 0,
    startYear: 0,
    startMonth: 1,
    endYear: 0,
    endMonth: 1,
    curYear: -1,
    curMonth: -1,
    curYearStr: "",
    curMonthStr: "",
    scrollEndProc: false,
    sideMarginTop: "0",
    sideHeight: "100%",
    todayShow: "",
    animation: ""
  },

  ready: function () {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initComponent: function(hblock, initYear, initMonth, initDay) {
      this.data.monthDayInfos = {};
      this.data.dayInfoCount = 0;
      this.data.hblock = hblock;
      this.data.startYear = initYear;
      this.data.startMonth = initMonth;
      this.data.endYear = initYear;
      this.data.endMonth = initMonth;
      this.data.curYear = initYear;
      this.data.curMonth = initMonth;
      var self = this;
      calCommonService.loadMonthInfo(initYear, initMonth, function (monthInfo) {
        self.appendMonthInfo(initYear, initMonth, monthInfo, function() {

          self.data.scrollTop = (initDay - 1) * hblock;
          self.loadPrevMonthDayInfo(function (countPrepend) {
            self.loadNextMonthDayInfo(function (countAppend) {
              console.log("init length: " + self.data.dayInfoCount);
              self.setData({
                scrollTop: self.data.scrollTop,
                curYearStr: "" + initYear,
                curMonthStr: util.monthInfos[initMonth - 1].cname,
                curYear: initYear,
                curMonth: initMonth
              })
            })
          });
        });
      })

    },

    loadPrevMonthDayInfo: function (callback) {
      if (this.data.curMonth > this.data.startMonth) {
        // already loaded
        if (typeof (callback) == "function") {
          callback(0);
        }
        return;
      }
      var neighborMonthes = util.getNeighborMonthes(this.data.startYear, this.data.startMonth);
      if (neighborMonthes.current != 0) {
        // the start year-month is not the first month, to load info and update data
        var prevMonth = neighborMonthes.monthes[neighborMonthes.current - 1];
        console.log("load prev month:" + prevMonth.year + "-" + prevMonth.month);

        wx.showLoading({
          title: '加载'+prevMonth.month+"月数据",
        });
        var self = this;
        calCommonService.loadMonthInfo(prevMonth.year, prevMonth.month, function (monthInfo) {
          self.prependMonthInfo(prevMonth.year, prevMonth.month, monthInfo,
           function () {
              if (typeof (callback) == "function") {
                callback(monthInfo.length);
                wx.hideLoading();
              }
          })
        })
      } else if (typeof (callback) == "function") {
        callback(0);
      }
    },

    loadNextMonthDayInfo: function (callback) {
      if (this.data.curMonth < this.data.endMonth) {
        // already loaded
        if (typeof (callback) == "function") {
          callback(0);
        }
        return;
      }
      var neighborMonthes = util.getNeighborMonthes(this.data.endYear, this.data.endMonth);
      if (neighborMonthes.current != neighborMonthes.monthes.length-1) {
        // the start year-month is not the last month, to load info and update data
        var nextMonth = neighborMonthes.monthes[neighborMonthes.current + 1];
        console.log("load next month:"+nextMonth.year+"-"+nextMonth.month);
        wx.showLoading({
          title: '加载' + nextMonth.month + "月数据",
        });
        var self = this;
        calCommonService.loadMonthInfo(nextMonth.year, nextMonth.month, function (monthInfo) {
          self.appendMonthInfo(nextMonth.year, nextMonth.month, monthInfo,
           function () {
            if (typeof (callback) == "function") {
              callback(monthInfo.length);
            }
            wx.hideLoading();

          });
        })
      } else if (typeof (callback) == "function") {
        callback(0);
      }
    },

    appendMonthInfo: function (year, month, monthInfo, callback) {
      var key = "m"+[year, month].map(util.formatNumber).join("");
      var infos = new Array();
      for (var i = 0; i < monthInfo.length; i++) {
        infos.push(this.wrapInfo(monthInfo[i]));
      }
      this.data.monthDayInfos[key] = infos;
      this.data.endYear = year;
      this.data.endMonth = month;
      this.data.dayInfoCount = this.data.dayInfoCount + monthInfo.length;

      var q = "monthDayInfos." + key;
      var setJson = {};
      setJson[q] = infos;

      this.setData(setJson, function() {
        if (typeof(callback) == "function") {
          callback();
        }
      })
    },

    prependMonthInfo: function (year, month, monthInfo, callback) {
      var key = "m"+[year, month].map(util.formatNumber).join("");
      var infos = new Array();
      for (var i = 0; i < monthInfo.length; i++) {
        infos.push(this.wrapInfo(monthInfo[i]));
      }
      this.data.monthDayInfos[key] = infos;
      this.data.startYear = year;
      this.data.startMonth = month;
      this.data.dayInfoCount = this.data.dayInfoCount + monthInfo.length;

      var q = "monthDayInfos."+key;
      var setJson = {};
      setJson[q] = infos;
      setJson["scrollTop"] = monthInfo.length * this.data.hblock + this.data.scrollTop

      this.setData(setJson, function () {
        if (typeof (callback) == "function") {
          callback();
        }
      })
    },

    wrapInfo: function(info) {
      info = calCommonService.wrapInfo(info);
      if (info.extraInfo) {
        info = info.extraInfo;
      }

      if (info.evtGoods && info.evtGoods.length <= 3) {
        info.evtGoodsStyle = "event-large";
      } else {
        info.evtGoodsStyle = "";
      }

      if (info.evtBads && info.evtBads.length <= 3) {
        info.evtBadsStyle = "event-large";
      } else {
        info.evtBadsStyle = "";
      }

      var d = new Date(info.date.replace(/-/g, "/"));
      var weekInfo = weekdays[d.getDay()];
      info.week = {
        cname: weekInfo.cname,
        ename: weekInfo.ename
      }
      // info.daystr = ""+(d.getMonth()+1)+"-"+util.formatNumber(d.getDate());

      info.daystr = util.formatNumber(d.getDate());
      info.dateshort = info.date.substr(0,10);
      var stiny = "";
      var hidetiny = "hide";
      if (info.solar && info.solar.length > 0) {
        stiny = info.solar;
        hidetiny = "";
      } else if (info.holiday && info.holiday.length > 0) {
        stiny = info.holiday;
        hidetiny = "";
      }
      info.stiny = stiny;
      info.hidetiny = hidetiny;
      if (util.isToday(d)) {
        info.style = "current";
      }
      info.icon = iconmap[info.luck];

      return info;
    },

    onScroll: function(e) {
      this.data.scrollTop = Math.max(0, e.detail.scrollTop);
      this.data.scrollHeight = e.detail.scrollHeight;
      this.adjustSideBar();
      var self = this;
      // self.setData({
      //   todayShow: "hide"
      // })

      // console.log("## on scroll ##");
      // console.log("## clear timer:" + timer + "##");
      clearTimeout(timer);
      
      var f = function () {
        self.scrollEnd();
      }

      // console.log("## onscroll: curm=" + this.data.curMonth + ", startm="+ this.data.startMonth + ", endm=" + this.data.endMonth);
      if (!this.data.scrollEndProc) {
        timer = setTimeout(f, 200);
      }
    },

    scrollEnd: function () {
      if (this.data.scrollEndProc) {
        return;
      }
      console.log("## on scroll end");
      this.data.hblock = this.data.scrollHeight / this.data.dayInfoCount;
      this.data.scrollEndProc = true;
      var self = this;
      
      var index = Math.round(this.data.scrollTop / this.data.hblock);
      var curDate = this.getDateByScrollTop();
      this.triggerEvent("scrollend", { year: curDate.getFullYear(), month: curDate.getMonth()+1 });
      
      if (index <= 10) {
        // if scroll to the block near the top, load previous month info
        self.loadPrevMonthDayInfo(function(countPrepend){
          self.setData({
            scrollEndProc: false
          })
        })
      } else if (index >= this.data.dayInfoCount-15) {
        // if scroll to the block near the bottom, load next month info
        self.loadNextMonthDayInfo(function (countAppend) {
          self.setData({
            scrollEndProc: false
          })
          self.adjustSideBar();
        });
      } else {
        self.adjustSideBar();
        self.setData({
          scrollEndProc: false
        })
      }
    },

    // adjust side bar's position according to the current scroll top value
    adjustSideBar: function() {
      // console.log("in adjust: scrollTop=" + this.data.scrollTop);
      var curDate = this.getDateByScrollTop();
      var dateMonthEnd = new Date(curDate.getTime());
      dateMonthEnd.setDate(1);
      dateMonthEnd.setMonth(dateMonthEnd.getMonth() + 1);
      var nextYear = dateMonthEnd.getFullYear();
      var nextMonth = dateMonthEnd.getMonth();
      dateMonthEnd.setDate(0);

      var dateStart = new Date([this.data.startYear, this.data.startMonth, 1].map(util.formatNumber).join("/") + " 00:00:00");
      var deltaDay = ((dateMonthEnd.getTime() - dateStart.getTime()) / util.dayMillseconds) - this.data.scrollTop / this.data.hblock;
      
      if (deltaDay > 2 && deltaDay <= 4) {
        // the remain days of current month is more than the days of next month
        // the side bar will show the current month on the upper part
        var h = (deltaDay+1)*20;
        var mt = 0;
        // console.log("h:"+h+"%, mt:"+mt+"%");
        this.setData({
          sideHeight: h + "%",
          sideMarginTop: "0",
          curYearStr: "" + curDate.getFullYear(),
          curMonthStr: util.monthInfos[curDate.getMonth()].cname,
          curYear: curDate.getFullYear(),
          curMonth: curDate.getMonth()+1
        })

      } else if (deltaDay <= 2) {
        // the remain days of current month is less than the days of next month
        // the side bar will show the next month on the lower part
        var mt = (deltaDay + 1) * this.data.hblock;
        var h = (4 - deltaDay )*20;
        // console.log("h:" + h + "%, mt:" + mt + "%");
        this.setData({
          sideHeight: h + "%",
          sideMarginTop: mt+"px",
          curYearStr: "" + nextYear,
          curMonthStr: util.monthInfos[nextMonth].cname,
          curYear: nextYear,
          curMonth: nextMonth+1
        })
      } else {
        this.setData({
          sideHeight: "100%",
          sideMarginTop: "0",
          curYearStr: "" + curDate.getFullYear(),
          curMonthStr: util.monthInfos[curDate.getMonth()].cname,
          curYear: curDate.getFullYear(),
          curMonth: curDate.getMonth() + 1
        })
      }
    },

    getDateByScrollTop: function(scrollTop) {
      if (scrollTop) {
        this.data.scrollTop = scrollTop;
      }
      var index = Math.round(this.data.scrollTop/this.data.hblock);
      var dateStart = new Date([this.data.startYear, this.data.startMonth, 1].map(util.formatNumber).join("/")+" 00:00:00");
      var timeStart = dateStart.getTime();
      var timeScroll = timeStart + index * util.dayMillseconds;
      var dateScroll = new Date(timeScroll);

      return dateScroll;
    },


    clickToday: function () {

      var animation = wx.createAnimation({
        duration: 100,
        timingFunction: "ease"
      })
      animation.opacity(0).step();
      this.setData({
        // todayShow: "hide",
        animation: animation.export()
      })
      var self = this;
      var f = function () {
        var today = new Date();
        var dMin = new Date(""+util.years[0]+"/01/01 00:00:00");

        var timeNow = Math.max(today.getTime(), dMin.getTime());
        today = new Date(timeNow);

        self.setData({
          monthDayInfos: {}
        }, function () {
          self.initComponent(self.data.hblock, today.getFullYear(), today.getMonth() + 1, today.getDate());
          var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease"
          })
          animation.opacity(1).step();
          self.setData({
            animation: animation.export()
          })

        });

      }
      setTimeout(f, 100);
    },

    isTodayInView: function () {
      var dayMin = this.getDateByScrollTop();
      var timeMin = dayMin.getTime();
      var timeMax = timeMin + util.dayMillseconds*5;

      var timeNow = (new Date()).getTime();


      return (timeNow >= timeMin && timeNow <= timeMax);

    }

  }
})
