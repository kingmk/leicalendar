// components/viewtag/viewtag.js

var util = require('../../utils/util.js');
var calCommonService = require('../../service/calCommonService.js');
const tagParams = {
  "default" : {
    "size": [40, 40, 40, 40, 40],
    "left": [-148, -84, -20, 44, 108],
    "tsize": [20, 20, 20, 20, 20],
    "showtitle": ""
  }, 
  "select0" : {
    "size": [100, 90, 80, 54, 40],
    "left": [-244, -106, 18, 127, 204],
    "tsize": [28, 20, 20, 20, 20],
    "showtitle": ""
  }, 
  "select1" :{
    "size": [80, 100, 80, 54, 40],
    "left": [-239, -123, 13, 122, 199],
    "tsize": [20, 28, 20, 20, 20],
    "showtitle": ""
  },
  "select2": {
    "size": [54, 80, 100, 80, 54],
    "left": [-249, -166, -50, 86, 195],
    "tsize": [20, 20, 28, 20, 20],
    "showtitle": ""
  },
  "select3": {
    "size": [40, 54, 80, 100, 80],
    "left": [-239, -176, -93, 23, 159],
    "tsize": [20, 20, 20, 28, 20],
    "showtitle": ""
  },
  "select4": {
    "size": [40, 54, 80, 90, 100],
    "left": [-244, -181, -98, 16, 144],
    "tsize": [20, 20, 20, 20, 28],
    "showtitle": ""
  }
}


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
    hideIntro: "",
    tagParam: tagParams["default"], 
    curSelTagIdx: -1,
    panelstyle: "hide",
    events: calCommonService.eventsSel
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart: function (event) {
      var x = event.touches[0].pageX;
      var selIdx = this.calcSelTag(x);
      var panelstyle = "hide";
      if (selIdx == 4) {
        panelstyle = "";
      }
      var animations = this.calcTagAnimations("select"+selIdx);
      this.setData({
        hideIntro: "hide",
        curSelTagIdx: selIdx,
        animations: animations,
        tagParam: tagParams["select" + selIdx],
        panelstyle: panelstyle
      })
      if (selIdx != 4) {
        this.selectTag(selIdx);
      } else {
        this.selectTag(-1);
      }
    },
    touchMove: function(event) {
      var self = this;
      if (self.isChanging) {
        return;
      }
      var x = event.touches[0].pageX;
      var selIdx = this.calcSelTag(x);
      if (this.data.curSelTagIdx == selIdx) {
        return;
      }
      var panelstyle= "hide";
      if (selIdx == 4) {
        panelstyle = "";
      }
      var animations = this.calcTagAnimations("select" + selIdx);
      self.isChanging = true;
      this.setData({
        hideIntro: "hide",
        curSelTagIdx: selIdx,
        animations: animations,
        tagParam: tagParams["select"+selIdx],
        panelstyle: panelstyle
      }, function () {
        self.isChanging = false;
      })
      var f = function() {
        self.isChanging = false;
      }
      setTimeout(f, 500);
      if (selIdx != 4) {
        this.selectTag(selIdx);
      } else {
        this.selectTag(-1);
      }
    },
    touchEnd: function (event) {
      // var selIdx = this.data.curSelTagIdx;
      // var duration = 600;
      // var animations = this.calcTagAnimations("default", duration);
      // this.setData({
      //   curSelTagIdx: -1,
      //   animations: animations,
      //   tagParam: tagParams["default"]
      // })
      
      // console.log("select:"+selIdx);
      // var self = this;
      // var f = function() {
      //   self.setData({
      //     hideIntro: ""
      //   })
      //   self.triggerEvent("showtag", { tagidx: -1 });
      // }
      // setTimeout(f, duration);
    },
    clickOtherTag: function(e) {
      this.selectTag(e.currentTarget.dataset.event);
    },
    selectTag: function(tagIdx) {
      if (tagIdx == -1) {
        this.triggerEvent("showtag", { tagidx: -1 });
        return;
      }
      // console.log("select tag:"+tagIdx);
      var event = calCommonService.events[tagIdx];
      if (event.type == "free") {
        this.triggerEvent("showtag", { tagidx: tagIdx });
        if (tagIdx >= 4) {
          for (var i=4; i<16; i++) {
            if (tagIdx != i) {
              this.data.events[i].style = "";
            } else {
              this.data.events[i].style = "selected";
            }
          }

          this.setData({
            events: this.data.events
          })
        }
      } else {
        wx.showModal({
          title: '点不开？',
          content: '订购个人定制版，解锁更多内容',
          showCancel: false
        })
      }
    },
    reset: function() {
      if (this.data.curSelTagIdx == -1) {
        return;
      }
      var duration = 600;
      var animations = this.calcTagAnimations("default", duration);
      for (var i = 4; i < 16; i++) {
        this.data.events[i].style = "";
      }
      this.setData({
        curSelTagIdx: -1,
        animations: animations,
        tagParam: tagParams["default"],
        panelstyle: "hide",
        events: this.data.events
      })
    },
    calcSelTag: function(x) {
      var xm = wx.getSystemInfoSync().windowWidth/2;
      var dx = (x - xm) * 750 / wx.getSystemInfoSync().windowWidth;
      var selIdx = 0;
      if (dx <-110) {
        selIdx = 0;
      } else if (dx < -40) {
        selIdx = 1;
      } else if (dx < 40) {
        selIdx = 2;
      } else if (dx < 110) {
        selIdx = 3;
      } else {
        selIdx = 4;
      }
      return selIdx;
    },
    calcTagAnimations: function(state, duration) {
      var params = tagParams[state];
      duration = duration || 300;
      var animations = new Array();
      for (var i=0; i<5; i++) {
        var animation = wx.createAnimation({
          duration: duration,
          timingFunction: 'ease',
        });
        animation.width(params.size[i]+"rpx").height(params.size[i]+"rpx").left(params.left[i]+"rpx").step();
        animations.push(animation.export());
      }
      return animations;
    }
  }
})
