
var img_yuanxiao = require("./imgdata_20190219_yuanxiao.js")
var img_yushui = require("./imgdata_20190220_yushui.js")


// console.log(test);

const specialDays = [
  {
    "timeStart": "2018-11-01 00:00:00",
    "timeEnd": "2019-01-02 23:59:59",
    "solar": "",
    "holiday": "元旦",
    "img": ""
  },
  {
    "timeStart": "2019-01-13 00:00:00",
    "timeEnd": "2019-01-13 23:59:59",
    "solar": "",
    "holiday": "腊八",
    "img": ""
  },
  {
    "timeStart": "2019-01-05 23:39:00",
    "timeEnd": "2019-01-20 16:59:59",
    "solar": "小寒",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-01-20 17:00:00",
    "timeEnd": "2019-02-03 23:59:59",
    "solar": "大寒",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-02-04 00:00:00",
    "timeEnd": "2019-02-04 23:59:59",
    "solar": "",
    "holiday": "除夕",
    "img": ""
  },
  {
    "timeStart": "2019-02-05 00:00:00",
    "timeEnd": "2019-02-07 23:59:59",
    "solar": "",
    "holiday": "春节",
    "img": ""
  },
  {
    "timeStart": "2019-02-14 00:00:00",
    "timeEnd": "2019-02-14 23:59:59",
    "solar": "",
    "holiday": "情人节",
    "img": ""
  },
  {
    "timeStart": "2019-02-08 00:00:00",
    "timeEnd": "2019-02-18 23:59:59",
    "solar": "立春",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-02-19 00:00:00",
    "timeEnd": "2019-02-19 23:59:59",
    "solar": "",
    "holiday": "元宵",
    "img": img_yuanxiao.imgdata
  },
  {
    "timeStart": "2019-02-20 00:00:00",
    "timeEnd": "2019-03-06 05:09:59",
    "solar": "雨水",
    "holiday": "",
    "img": img_yushui.imgdata
  },
  {
    "timeStart": "2019-03-08 00:00:00",
    "timeEnd": "2019-03-08 23:59:59",
    "solar": "",
    "holiday": "妇女节",
    "img": ""
  },
  {
    "timeStart": "2019-03-06 05:10:00",
    "timeEnd": "2019-03-21 05:57:59",
    "solar": "惊蛰",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-03-21 05:58:00",
    "timeEnd": "2019-04-05 09:50:59",
    "solar": "春分",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-04-05 09:51:00",
    "timeEnd": "2019-04-20 16:54:59",
    "solar": "清明",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-05-01 00:00:00",
    "timeEnd": "2019-05-01 23:59:59",
    "solar": "",
    "holiday": "劳动节",
    "img": ""
  },
  {
    "timeStart": "2019-04-20 16:55:00",
    "timeEnd": "2019-05-06 03:02:59",
    "solar": "谷雨",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-05-12 00:00:00",
    "timeEnd": "2019-05-12 23:59:59",
    "solar": "",
    "holiday": "母亲节",
    "img": ""
  },
  {
    "timeStart": "2019-05-06 03:03:00",
    "timeEnd": "2019-05-21 15:58:59",
    "solar": "立夏",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-06-01 00:00:00",
    "timeEnd": "2019-06-01 23:59:59",
    "solar": "",
    "holiday": "儿童节",
    "img": ""
  },
  {
    "timeStart": "2019-05-21 15:59:00",
    "timeEnd": "2019-06-06 07:05:59",
    "solar": "小满",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-06-07 00:00:00",
    "timeEnd": "2019-06-07 23:59:59",
    "solar": "",
    "holiday": "端午节",
    "img": ""
  },
  {
    "timeStart": "2019-06-16 00:00:00",
    "timeEnd": "2019-06-16 23:59:59",
    "solar": "",
    "holiday": "父亲节",
    "img": ""
  },
  {
    "timeStart": "2019-06-06 07:06:00",
    "timeEnd": "2019-06-21 23:53:59",
    "solar": "芒种",
    "holiday": "",
    "img": ""
  },
  {
    "timeStart": "2019-06-21 23:54:00",
    "timeEnd": "2019-06-30 23:59:59",
    "solar": "夏至",
    "holiday": "",
    "img": ""
  }
];

module.exports = {
  specialDays: specialDays
}