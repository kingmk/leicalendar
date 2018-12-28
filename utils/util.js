
var commonData = require('./data.js');

const dayMillseconds = 86400000;

const hostBaseImage = "/static/images/";

const solarImgMap = { "小寒": { "bg": "solar_01_xiaohan.jpg" }, "大寒": { "bg": "solar_02_dahan.jpg" } };


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const years = [2019];
const monthInfos = [{ "cname": "一月", "ename": "Jan.", "value": 1 }, { "cname": "二月", "ename": "Feb.", "value": 2 }, { "cname": "三月", "ename": "Mar.", "value": 3 }, { "cname": "四月", "ename": "Apr.", "value": 4 }, { "cname": "五月", "ename": "May.", "value": 5 }, { "cname": "六月", "ename": "June.", "value": 6 }, { "cname": "七月", "ename": "July.", "value": 7 }, { "cname": "八月", "ename": "Aug.", "value": 8 }, { "cname": "九月", "ename": "Sept.", "value": 9 }, { "cname": "十月", "ename": "Oct.", "value": 10 }, { "cname": "十一月", "ename": "Nov.", "value": 11 }, { "cname": "十二月", "ename": "Dec.", "value": 12 }];

const getAllMonthes = function() {
  var allMonthes = new Array();
  for (var i=0; i<years.length; i++) {
    for(var j=0; j<12; j++) {
      var item = {
        year : years[i],
        month: j+1,
        monthInfo: monthInfos[j]
      }
      allMonthes.push(item);
    }
  }
  console.log(allMonthes);
  return allMonthes;
}


const getYearIndex = (year) => {
  var i = 0;
  for (i = 0; i < years.length; i++) {
    if (year == years[i]) {
      break;
    }
  }
  return i;
}


const getNeighborMonthes = (year, month) => {
  year = parseInt(year);
  month = parseInt(month);
  var minYear = years[0];
  var maxYear = years[years.length-1];
  var curr = {
    year: year,
    month: month,
    monthInfo: monthInfos[month-1]
  }
  var prev = null;
  var next = null;
  var prevy = year, nexty = year;
  var prevm = month-1, nextm = month+1;

  if (month == 1) {
    prevm = 12;
    prevy = year-1;
  } else if (month == 12) {
    nextm = 1;
    nexty = year+1;
  }
  if (prevy >= minYear) {
    prev = {
      year: prevy,
      month: prevm,
      monthInfo: monthInfos[prevm-1]
    }
  }
  if (nexty <= maxYear) {
    next = {
      year: nexty,
      month: nextm,
      monthInfo: monthInfos[nextm-1]
    }
  }
  var monthes = new Array();
  var current = 1;
  if (!prev) {
    current = 0;
    monthes = [curr, next, {year: year, month: month+2, monthInfo: monthInfos[month+1]}];
  } else if (!next) {
    current = 2;
    monthes = [{ year: year, month: month - 2, monthInfo: monthInfos[month-3] }, prev, curr];
  } else {
    monthes = [prev, curr, next]
  }

  return {
    monthes: monthes,
    current: current
  }
}

const isToday = (date) => {
  var today = new Date();
  return (date.getFullYear() == today.getFullYear()) && (date.getMonth() == today.getMonth()) && (date.getDate() == today.getDate());
}

const getSolarImages = (solarName) => {
  var solar = solarImgMap[solarName];
  var imageUrl = "";
  if (solar) {
    imageUrl = hostBaseImage + solar.bg;
  }
  return imageUrl;
}

const rpx2px = (v) => {
  var winW = wx.getSystemInfoSync().windowWidth;
  var rpx = winW / 750;
  return v*rpx;
}

const px2rpx = (v) => {
  var winW = wx.getSystemInfoSync().windowWidth;
  var rpx = winW/750;
  return v/rpx;
}

const isSpecialDay = (date) => {
  var s = formatTime(date);
  
  var specialDays = commonData.specialDays;
  var info = null;
  for (var i =0; i<specialDays.length; i++) {
    var tmp = specialDays[i]
    if (s >= tmp.timeStart && s<=tmp.timeEnd) {
      info = tmp;
      break;
    }
  }

  return info;
}

const isMobile = (str) => {
  var reg = /^1\d{10}$/;
  return reg.test(str);
}

module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  rpx2px: rpx2px,
  px2rpx: px2rpx,
  isSpecialDay: isSpecialDay,
  getAllMonthes: getAllMonthes,
  getYearIndex: getYearIndex,
  getNeighborMonthes: getNeighborMonthes,
  getSolarImages: getSolarImages,
  isToday: isToday,
  years: years,
  monthInfos: monthInfos,
  hostBaseImage: hostBaseImage,
  dayMillseconds: dayMillseconds,
  isMobile: isMobile
}
