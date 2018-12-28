var img_yuandan = require('./imgdata_00yuandan.js');
var img_xiaohan = require('./imgdata_02xiaohan.js');


const specialDays = [
  {
    "timeStart": "2018-11-01 00:00:00",
    "timeEnd": "2019-01-02 23:59:59",
    "solar": "",
    "holiday": "元旦",
    "img": img_yuandan.imgdata
  },
  {
    "timeStart": "2019-01-13 00:00:00",
    "timeEnd": "2019-01-13 23:59:59",
    "solar": "",
    "holiday": "腊八",
    "img": "/static/images/bg_dahan.jpeg"
  },
  {
    "timeStart": "2019-01-05 23:39:00",
    "timeEnd": "2019-01-20 16:59:59",
    "solar": "小寒",
    "holiday": "",
    "img": img_xiaohan.imgdata
  },
  {
    "timeStart": "2019-01-20 17:00:00",
    "timeEnd": "2019-02-03 23:59:59",
    "solar": "大寒",
    "holiday": "",
    "img": "/static/images/bg_dahan.jpeg"
  }
];

module.exports = {
  specialDays: specialDays
}