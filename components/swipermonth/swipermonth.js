// components/swipermonth/swipermonth.js


var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    year: {
      type: Number,
      value: 2018
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
    current: 1,
    duration: 500,
    isLoop: true,
    tagIdx: -1,
    changeFunc: "swipeEnd",
    isChangeValid: true
  },

  ready: function () {
    this.initSwiper();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initSwiper: function () {
      var neighborData = util.getNeighborMonthes(this.data.year, this.data.month);

      this.setData({
        monthes: neighborData.monthes,
        current: neighborData.current,
        isLoop: (neighborData.current == 1)
      });

      for (var i = 0; i < neighborData.monthes.length; i++) {
        var monthData = neighborData.monthes[i];
        // calCommonService.loadMonthInfo(monthData.year, monthData.month);
      }
    },

    swipeEnd: function (e) {
      if (!this.data.isChangeValid) {
        this.setData({
          isChangeValid: true
        })
        return;
      }

      var cur = e.detail.current;
      var monthData = this.data.monthes[cur];
      var curyear = monthData.year;
      var curmonth = monthData.month;
      // clear any selected date info
      for (var i=0; i<3; i++) {
        var calendar = this.selectComponent("#calendar-" + i);
        calendar.clearSelect(true, false);
      }

      this.replaceSwiper(cur);


      if (this.data.tagIdx != -1) {
        var self = this;
        var f = function () {
          self.showTag(self.data.tagIdx);
        }
        setTimeout(f, 100);
      }
      this.triggerEvent("swipemonth", { year: curyear, month: curmonth });

    },

    // when current item changed, the data on other item should be replaced
    // curNew : the new current index,
    replaceSwiper: function (curNew) {
      console.log("replaceSwiper");
      var monthNew = this.data.monthes[curNew];
      var monthesNew = new Array(3);

      var neighborData = util.getNeighborMonthes(monthNew.year, monthNew.month);
      // console.log(JSON.stringify(neighborData));
      var neighborCur = neighborData.current;
      var neighborMonthes = neighborData.monthes;
      if (neighborCur == 0) {
        // swipe to the first month, no previous month
        monthesNew[curNew] = neighborMonthes[0];
        monthesNew[(curNew + 1) % 3] = neighborMonthes[1];
        monthesNew[(curNew + 2) % 3] = neighborMonthes[2];
      } else if (neighborCur == 1) {
        // normal case, has both previous and next month
        monthesNew[curNew] = neighborMonthes[1];
        monthesNew[(curNew + 2) % 3] = neighborMonthes[0];
        monthesNew[(curNew + 1) % 3] = neighborMonthes[2];
      } else if (neighborCur == 2) {
        // swipe to the last month, no next month
        monthesNew[curNew] = neighborMonthes[2];
        monthesNew[(curNew - 2 + 3) % 3] = neighborMonthes[0];
        monthesNew[(curNew - 1 + 3) % 3] = neighborMonthes[1];
      }

      for (var i=0; i< 3; i++) {
        // if (i == curNew) {
        //   continue;
        // }
        var calendar = this.selectComponent("#calendar-" + i);
        var monthData = monthesNew[i];
        // console.log("#"+curNew+", init calendar for "+monthData.year+"-"+monthData.month);
        console.log("init calendar");
        calendar.initCalendar(monthData.year, monthData.month);
      }
      var duration = 500;
      // if hit the first or last month, should refresh the swiper content in short duration
      if (neighborCur != 1) {
        duration = 100
        var self = this;
        var f = function () {
          console.log("refresh swiper");
          self.refreshSwiper(neighborData, curNew);
        }
        setTimeout(f, 10);
      }

      this.setData({
        monthes: monthesNew,
        current: curNew,
        isLoop: (neighborCur == 1),
        duration: duration
      })
    },
    // just change the month data, without trigger swiper's animation
    changeMonthData: function(neighborData) {
      var monthes = neighborData.monthes;
      var idxCur = this.data.current;
      var idxNew = neighborData.current;

      for (var i = 0; i < 3; i++) {
        var calendar = this.selectComponent("#calendar-" + idxCur);
        var monthData = monthes[idxNew];
        this.data.monthes[idxCur] = monthData;
        calendar.initCalendar(monthData.year, monthData.month);

        idxCur = (idxCur+1)%3;
        idxNew = (idxNew+1)%3;
      }

      var duration = 500;
      if (neighborData.current != 1) {
        duration = 100
        var self = this;
        var f = function () {
          console.log("refresh swiper");
          self.refreshSwiper(neighborData, self.data.current);
        }
        setTimeout(f, 10);
      }

      this.setData({
        monthes: this.data.monthes,
        isLoop: (neighborData.current == 1),
        duration: duration
      });
    },

    // refresh the whole swiper item data
    refreshSwiper: function (neighborData, current) {
      var monthes = neighborData.monthes;

      for (var i = 0; i < 3; i++) {
        var calendar = this.selectComponent("#calendar-" + i);
        var monthData = monthes[i];
        calendar.initCalendar(monthData.year, monthData.month);
      }
      var isChangeValid = false;
      // if the current has no change, should not invalid the swipeEnd function
      if (current == neighborData.current) {
        isChangeValid = true;
      }
      this.setData( {
        current: neighborData.current,
        monthes: monthes,
        isChangeValid: isChangeValid,
        duration: 500
      });

      if (this.data.tagIdx != -1) {
        var self = this;
        var f = function() {
          self.showTag(self.data.tagIdx);
        }
        setTimeout(f, 100);
      }
    },

    selectToday: function() {
      var curMonthData = this.data.monthes[this.data.current];
      var today = new Date();
      if (curMonthData.year == today.getFullYear() && curMonthData.month == (today.getMonth()+1)) {
        var calendar = this.selectComponent("#calendar-" + this.data.current);
        calendar.selectToday();
      }
    },
    
    showTag: function(tagIdx) {
      var calendar = this.selectComponent("#calendar-" + this.data.current);
      this.data.tagIdx = tagIdx;
      calendar.clearSelect(true, true);
      calendar.showTag(tagIdx);
    },

    onClickDate: function(e) {
      this.data.tagIdx = -1;
      this.triggerEvent("clickdate", {dateinfo: e.detail.dateinfo});
    },

    onClickInfo: function (e) {
      this.triggerEvent("clickinfo", { dateinfo: e.detail.dateinfo });
    },

    onShowSpecial: function(e) {
      this.triggerEvent("showSpecial", {specialday: e.detail.specialday, startx: e.detail.startx, starty: e.detail.starty});
    }
  }
})
