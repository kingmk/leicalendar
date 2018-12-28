// components/calbook/calbook.js

var util = require('../../utils/util.js');
const pathCalBook = "books/";
const cntFrame = 24;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookType: {
      type: String,
      value: ""
    },
    frameSec: {
      type: Number,
      value: 80
    },
    animate: {
      type: Boolean,
      value: false,
      observer: function(vCur, vPre) {
        console.log("onanimate: "+vCur+", "+vPre);
        this.changeAnimate(vCur);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timer: 0,
    curFrame: 0,
    images: []
  },

  ready: function () {
    // var self = this;
    // this.data.timer = setInterval(function() {
    //   self.changeFrame();
    // }, this.data.frameSec);
    this.initFrames();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initFrames: function() {
      var images = new Array();
      for (var i = 0; i < cntFrame; i++) {
        var image = {
          url: util.hostBaseImage + pathCalBook + this.data.bookType + "_" + util.formatNumber(i) + ".png",
          loaded: false,
          style: ""
        }
        images.push(image);
      }
      images[0].style = "show";
      this.setData({
        images: images
      });

      var self = this;
      
      var timerStart = setInterval(function(){
        if (self.checkImagesLoaded()) {
          clearInterval(timerStart);
          if (self.data.animate) {
            self.data.timer = setInterval(function () {
              self.changeFrame();
            }, self.data.frameSec);
          }
        }
      }, 100);
    }, 

    loadImage: function(event) {
      var idx = parseInt(event.currentTarget.dataset.index);
      this.data.images[idx].loaded = true;
    },

    checkImagesLoaded: function() {
      var allloaded = true;
      for (var i = 0; i < cntFrame; i++) {
        if (!this.data.images[i].loaded) {
          allloaded = false;
          break;
        }
      }
      return allloaded;
    },

    changeFrame: function() {
      var imageCur = this.data.images[this.data.curFrame];
      var imagePre = this.data.images[(this.data.curFrame+cntFrame-1)%cntFrame];
      imagePre.style = "";
      imageCur.style = "show";
      this.data.curFrame = (this.data.curFrame + 1) % cntFrame;
      this.setData(this.data);
    },

    changeAnimate: function(state) {
      var self = this;
      if(this.data.images.length == 0) {
        return;
      }
      if (state) {
        self.data.timer = setInterval(function () {
          self.changeFrame();
        }, self.data.frameSec);
      } else {
        clearInterval(self.data.timer);
        for (var i=0; i<cntFrame; i++) {
          self.data.images[i].style = "";
        }
        self.data.images[0].style = "show";
        self.data.curFrame = 0;
        self.setData(self.data);
      }
    }

  }
})
