// components/scrollday/scrollday.js


var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');
var timer = -1;

var weekdays = [{ "cname": "周日", "ename": "Sun." }, { "cname": "周一", "ename": "Mon." }, { "cname": "周二", "ename": "Tue." }, { "cname": "周三", "ename": "Wed." }, { "cname": "周四", "ename": "Thur." }, { "cname": "周五", "ename": "Fri." }, { "cname": "周六", "ename": "Sat." }];

var iconmap = {"大凶":"icon_luck_worst.png", "小凶":"icon_luck_bad.png", "平":"icon_luck_even.png", "小吉":"icon_luck_good.png", "大吉":"icon_luck_best.png"};


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
    dayInfos: [],
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
    animation: "",
    scrollViewId: ""
  },

  ready: function () {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initComponent: function(hblock, initYear, initMonth, initDay) {

      this.data.dayInfos = new Array();
      this.data.hblock = hblock;
      this.data.startYear = initYear;
      this.data.startMonth = initMonth;
      this.data.endYear = initYear;
      this.data.endMonth = initMonth;
      this.data.curYear = initYear;
      this.data.curMonth = initMonth;
      var self = this;
      calCommonService.loadMonthInfo(initYear, initMonth, function (monthInfo) {
        self.appendMonthInfo(initYear, initMonth, monthInfo);
        self.loadPrevMonthDayInfo(function(countPrepend) {
          self.data.scrollTop = (countPrepend+initDay-1)*self.data.hblock;
          self.loadNextMonthDayInfo(function(countAppend) {
            self.setData({
              dayInfos: self.data.dayInfos,
              scrollTop: self.data.scrollTop,
              curYearStr: "" + initYear,
              curMonthStr: util.monthInfos[initMonth-1].cname,
              curYear: initYear,
              curMonth: initMonth
            })
          })
        });
      })

    },

    setScroll: function(hblock, count) {
      this.setData({
        hblock: hblock,
        scrollTop: hblock*count
      })
    },

    loadPrevMonthDayInfo: function (callback) {
      console.log("## to load prev with: curm=" + this.data.curMonth + ", startm=" + this.data.startMonth);
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
          self.prependMonthInfo(prevMonth.year, prevMonth.month, monthInfo);
          if (typeof (callback) == "function") {
            callback(monthInfo.length);
          }
        })
      } else if (typeof (callback) == "function") {
        callback(0);
      }
    },

    loadNextMonthDayInfo: function (callback) {
      console.log("## to load next with: curm="+this.data.curMonth+", endm="+this.data.endMonth);
      if (this.data.curMonth < this.data.endMonth) {
        // already loaded
        if (typeof (callback) == "function") {
          callback();
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
          self.appendMonthInfo(nextMonth.year, nextMonth.month, monthInfo);
          if (typeof (callback) == "function") {
            callback(monthInfo.length);
          }
          wx.hideLoading();
        })
      } else if (typeof (callback) == "function") {
        callback();
      }
    },

    appendMonthInfo: function (year, month, monthInfo) {
      for (var i = 0; i < monthInfo.length; i++) {
        this.data.dayInfos.push(this.wrapInfo(monthInfo[i]));
      }
      this.data.endYear = year;
      this.data.endMonth = month;
    },

    prependMonthInfo: function (year, month, monthInfo) {
      for (var i=monthInfo.length-1; i>=0; i--) {
        this.data.dayInfos.splice(0, 0, this.wrapInfo(monthInfo[i]));
      }
      this.data.startYear = year;
      this.data.startMonth = month;
    },

    wrapInfo: function(info) {
      info = calCommonService.wrapInfo(info);
      if (info.extraInfo) {
        info = info.extraInfo;
      }
      var d = new Date(info.date.replace(/-/g, "/"));
      var weekInfo = weekdays[d.getDay()];
      info.week = {
        cname: weekInfo.cname,
        ename: weekInfo.ename
      }
      // info.daystr = "" + (d.getMonth() + 1) + "-" + util.formatNumber(d.getDate());
      
      info.daystr = "" + util.formatNumber(d.getDate());
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

      console.log("## onscroll: curm=" + this.data.curMonth + ", startm="+ this.data.startMonth + ", endm=" + this.data.endMonth);
      if (!this.data.scrollEndProc) {
        timer = setTimeout(f, 200);
      }
      // console.log("## create timer:" + timer + "##");
    },

    scrollEnd: function () {
      if (this.data.scrollEndProc) {
        return;
      }
      console.log("## on scroll end");
      this.data.hblock = this.data.scrollHeight / this.data.dayInfos.length;
      this.data.scrollEndProc = true;
      var self = this;
      
      var index = Math.round(this.data.scrollTop / this.data.hblock);
      var dayInfo = this.data.dayInfos[index];
      var curDate = new Date(dayInfo.date.replace(/-/g, "/"));
      this.triggerEvent("scrollend", { year: curDate.getFullYear(), month: curDate.getMonth()+1 });
      
      if (index <= 10) {
        // if scroll to the block near the top, load previous month info
        self.loadPrevMonthDayInfo(function(countPrepend){
          self.setData({
            scrollTop: countPrepend*self.data.hblock + self.data.scrollTop,
            dayInfos: self.data.dayInfos,
          }, function() {
            console.log("####after prev loading");
            wx.hideLoading();
            self.setData({
              scrollEndProc: false
            })
          })
          // var f = function() {
          // }
          // setTimeout(f, 500);
        })
      } else if (index >= this.data.dayInfos.length-15) {
        // if scroll to the block near the bottom, load next month info
        self.loadNextMonthDayInfo(function (countAppend) {
          self.setData({
            dayInfos: self.data.dayInfos,
            scrollEndProc: false
          })
          self.adjustSideBar();
        });
        f();
      } else {
        self.adjustSideBar();
        self.setData({
          scrollEndProc: false
        })
      }
    },

    // onScrollTop: function(e) {
    //   // console.log(e);
    //   // this.data.scrollTop = e.detail.scrollTop;
    //   // this.data.scrollHeight = e.detail.scrollHeight;
    //   this.data.hblock = this.data.scrollHeight / this.data.dayInfos.length;

    //   var self = this;
    //   var dayInfo = self.data.dayInfos[0];
    //   self.loadPrevMonthDayInfo(function (countPrepend) {
    //     console.log("====countPrepend:"+countPrepend+"， hblock: "+self.data.hblock+"====");
    //     var scrollTop = countPrepend * self.data.hblock;
    //     console.log("====scrollTop:" + scrollTop + ", viewid: " + "scroll-" + dayInfo.dateshort +"====");
    //     self.setData({
    //       // scrollTop: countPrepend * self.data.hblock,
    //       scrollViewId: "scroll-"+dayInfo.dateshort,
    //       dayInfos: self.data.dayInfos,
    //       // scrollEndProc: false
    //     })
    //     // var f = function() {
    //     //   self.setData({
    //     //     dayInfos: self.data.dayInfos
    //     //   });
    //     // }
    //     // setTimeout(f, 50);

    //     // setTimeout(function() {
    //     //   self.setData({
    //     //     scrollTop: 1000
    //     //   });
    //     //   wx.showToast({
    //     //     title: 'scroll top to 1000',
    //     //   })
    //     // }, 1500);
        
    //     // self.adjustSideBar();
    //   })
    // },

    // onScrollBottom: function (e) {

    //   var self = this;
    //   self.loadNextMonthDayInfo(function (countAppend) {
    //     self.setData({
    //       // scrollTop: countPrepend * self.data.hblock,
    //       dayInfos: self.data.dayInfos,
    //       // scrollEndProc: false
    //     })
    //     self.adjustSideBar();
    //   });
    // },

    // adjust side bar's position according to the current scroll top value
    adjustSideBar: function() {
      var tmpIndex = this.data.scrollTop / this.data.hblock;
      var index = Math.round(tmpIndex);
      var dayInfo = this.data.dayInfos[index];
      console.log("in adjust: scrollTop="+this.data.scrollTop+", index="+index+", infolength:"+this.data.dayInfos.length);
      var curDate = new Date(dayInfo.date.replace(/-/g, "/"));
      var curDay = curDate.getDate();
      var tmpDate = new Date(dayInfo.date.replace(/-/g, "/"));
      tmpDate.setDate(1);
      tmpDate.setMonth(tmpDate.getMonth() + 1);
      var nextYear = tmpDate.getFullYear();
      var nextMonth = tmpDate.getMonth();
      tmpDate.setDate(0);
      var maxDay = tmpDate.getDate();

      var deltaDay = maxDay-curDay;
      if (deltaDay >= 2 && deltaDay <= 4) {
        // the remain days of current month is more than the days of next month
        // the side bar will show the current month on the upper part
        var h = (deltaDay+1+index-tmpIndex)*20;
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

      } else if (deltaDay < 2) {
        // the remain days of current month is less than the days of next month
        // the side bar will show the next month on the lower part
        var mt = (deltaDay + 1+index-tmpIndex) * this.data.hblock;
        var h = (4 - deltaDay -index+tmpIndex)*20;
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
        self.initComponent(self.data.hblock, today.getFullYear(), today.getMonth() + 1, today.getDate());
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "ease"
        })
        animation.opacity(1).step();
        self.setData({
          animation: animation.export()
        })
      }
      setTimeout(f, 100);
    },

    isTodayInView: function () {
      var index = Math.round(this.data.scrollTop / this.data.hblock);
      var dayMinInfo = this.data.dayInfos[index];
      var dayMaxInfo = this.data.dayInfos[Math.min(this.data.dayInfos.length-1, index+4)];
      var dayMin = new Date(dayMinInfo.date.replace(/-/g, "/"));
      var dayMax = new Date(dayMaxInfo.date.replace(/-/g, "/"));
      dayMax.setDate(dayMax.getDate()+1);
      var today = new Date();

      return (today.getTime() >= dayMin.getTime() && today.getTime() < dayMax.getTime());

    },


  }
})
