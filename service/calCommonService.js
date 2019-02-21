
var util = require('../utils/util.js');

// const hostname = "http://192.168.31.113:8080/";
const hostname = "https://leimenyi.com.cn/";
const keyMonthData = "MONTH_DATA";
const keySolarData = "SOLAR_DATA";
const keyOpenId = "OPENID";
const keyCityData = "PLACE_DATA";
const version = "0.9.0";

const events = [{ "name": "嫁娶", "type": "free" }, { "name": "移徙", "type": "free" }, { "name": "出行", "type": "free" }, { "name": "动土", "type": "free" }, { "name": "开市", "type": "free" }, { "name": "立券", "type": "free" }, { "name": "交易", "type": "free" }, { "name": "纳财", "type": "free" }, { "name": "会友", "type": "free" }, { "name": "理发", "type": "free" }, { "name": "订婚", "type": "free" }, { "name": "扫舍", "type": "free" }, { "name": "赴任", "type": "free" }, { "name": "求医", "type": "free" }, { "name": "祈福", "type": "free" }, { "name": "安葬", "type": "free" }];
const eventsSel = [{ "name": "嫁娶", "type": "free" }, { "name": "搬家", "type": "free" }, { "name": "出行", "type": "free" }, { "name": "动土", "type": "free" }, { "name": "开业", "type": "free" }, { "name": "签约", "type": "free" }, { "name": "交易", "type": "free" }, { "name": "置业", "type": "free" }, { "name": "会友", "type": "free" }, { "name": "理发", "type": "free" }, { "name": "订婚", "type": "free" }, { "name": "扫舍", "type": "free" }, { "name": "入职", "type": "free" }, { "name": "求医", "type": "free" }, { "name": "祈福", "type": "free" }, { "name": "安葬", "type": "free" }];
const eventCount = 16;
const eventv = ["","宜","忌"];

function genOpenIdKey() {
  return keyOpenId + "_" + version;
}

function genCurUserinfoKey() {
  return "CUR_USERINFO_"+version;
}

function genMonthInfoKey(infoId, year, month) {
  return keyMonthData + "_" + version + "_" + infoId + "_" + year + "-" + util.formatNumber(month);
}

function genSolarKey(year) {
  return keySolarData + "_" + version + "_" + year;
}

function genCityDataKey() {
  return keyCityData + "_0.0";
}

// params = {
//   path: "calendar/xx",
//   method: "GET",
//   data: {},
//   success: function,
//   fail: function
// }
function apiCall(params) {
  wx.request({
    header: params.header,
    url: hostname + params.path,
    data: params.data,
    method : params.method || "GET",
    success(res) {
      if (res.data.head.code != "0000") {

        wx.showModal({
          title: '错误提示',
          content: res.data.head.msg,
          showCancel: false
        });
        if (typeof (params.fail) == "function") {
          params.fail(res.data.body);
        }
      } else if (typeof (params.success) == "function") {
        params.success(res.data.body);
      }
    },
    fail(res) {
      wx.showModal({
        title: '错误提示',
        content: '服务器暂时异常，请稍后再试',
        showCancel: false
      });
      if (typeof (params.fail) == "function") {
        params.fail(res.data.body);
      }
    }
  });
}

function getOpenId(fCallback) {
  var key = genOpenIdKey();
  var openId = wx.getStorageSync(key);
  if (typeof (openId) == "string" && openId.length > 0) {
    console.log("get openid from storage: " + openId);
    if (typeof (fCallback) == "function") {
      fCallback(openId);
    }
    return;
  } else {
    login(fCallback);
  }
}

function login(fCallback) {
  wx.login({
    success(res) {
      if (res.code) {
        var params = {
          path: "calendar/user/login",
          data: {
            code: res.code
          }
        }
        apiCall({
          path: "calendar/user/login",
          data: {
            code: res.code
          },
          success: function(data) {
            var openId = data.openId;
            console.log("get openid from server: " + openId);

            wx.setStorage({
              key: genOpenIdKey(),
              data: openId,
            });

            if (typeof (fCallback) == "function") {
              fCallback(openId);
            }
          }
        });
      }
    }
  })
}

function fetchSmsCode(mobile, userinfoId, type, fSuccess, fFail) {
  var data = {
    mobile: mobile,
    type: type
  };
  if (userinfoId != null) {
    data.userinfoId = userinfoId;
  }
  apiCall({
    path: "calendar/user/sms_send",
    data: data,
    success: function (data) {
      if (typeof (fSuccess) == "function") {
        fSuccess();
      }
    },
    fail: function (data) {
      if (typeof (fFail) == "function") {
        fFail();
      }
    }
  })
}

function getMainUserInfo(fSuccess, fFail) {
  getOpenId(function (openId) {
    apiCall({
      path: "calendar/user/get_userinfo",
      data: {
        openId: openId,
        type: "MAIN"
      },
      success: function (data) {
        if (typeof (fSuccess) == "function") {
          fSuccess(data.userinfo);
        }
      },
      fail: function (data) {
        if (typeof (fFail) == "function") {
          fFail(data.userinfo);
        }
      }
    })
  });

}

function getUser(fCallback) {
  getOpenId(function(openId) {
    apiCall({
      path: "calendar/user/get_by_openId",
      data: {
        openId: openId
      },
      success: function(data) {
        if(typeof(fCallback) == "function") {
          fCallback(data);
        }
      }
    })
  });
}

function createUserInfo(userInfo, fSuccess, fFail) {
  getOpenId(function (openId) {
    userInfo.openId = openId;
    apiCall({
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      path: "calendar/user/create_user_info",
      method: "post",
      data: userInfo,
      success: function (data) {
        if (typeof (fSuccess) == "function") {
          fSuccess(data.userinfo);
        }
      },
      fail: function (data) {
        if (typeof (fFail) == "function") {
          fFail();
        }
      }
    });
  })

}

function updateUserInfo(userInfo, fSuccess, fFail) {
  getOpenId(function (openId) {
    userInfo.openId = openId;
    apiCall({
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      path: "calendar/user/update_user_info",
      method: "post",
      data: userInfo,
      success: function (data) {
        if (typeof (fSuccess) == "function") {
          fSuccess(data.userinfo);
        }
      },
      fail: function (data) {
        if (typeof (fFail) == "function") {
          fFail();
        }
      }
    });
  })
}

function unifiedOrder(infoId, fCallback) {
  getOpenId(function (openId) {
    apiCall({
      path: "calendar/order/unifiedorder_weixin",
      data: {
        openId: openId,
        infoId: infoId
      },
      success: function (data) {
        if (typeof (fCallback) == "function") {
          fCallback(data);
        }
      }
    })
  });
}

function succeedOrder(orderId, fCallback) {
  getOpenId(function (openId) {
    apiCall({
      path: "calendar/order/succeed",
      data: {
        openId: openId,
        orderId: orderId
      },
      success: function (data) {
        if (typeof (fCallback) == "function") {
          fCallback(data);
        }
      }
    })
  });

}

function loadMonthInfo(year, month, fCallback) {
  var userinfo = wx.getStorageSync(genCurUserinfoKey());
  var infoId = userinfo.id;
  var monthInfo = null;
  if ((monthInfo = getMonthInfo(infoId, year, month)) != null) {
    if (typeof (fCallback) == "function") {
      fCallback(monthInfo);
    }
    return;
  }

  getOpenId(function (openId) {
    apiCall({
      path: "calendar/get_month_calendar",
      data: {
        openId: openId,
        infoId: infoId,
        y: year,
        m: month
      },
      success: function (data) {

        wx.setStorage({
          key: genMonthInfoKey(infoId, year, month),
          data: data.list,
        });

        if (typeof (fCallback) == "function") {
          fCallback(data.list);
        }
      }
    })
  });
}

function loadSolarInfo(year, fCallback) {
  var solarInfo = null;
  if ((solarInfo = getSolarInfo(year)) != null) {
    if (typeof (fCallback) == "function") {
      fCallback(solarInfo);
    }
    return;
  }
  wx.request({
    url: hostname + "calendar/get_solar",
    data: {
      y: year
    }, success(res) {
      if (res.data.head.code != "0000") {
        wx.showToast({
          title: '数据获取异常',
        })
        return;
      }
      console.log("save solar data for " + year + ":"+JSON.stringify(res.data.body.list));
      wx.setStorage({
        key: genSolarKey(year),
        data: res.data.body.list,
      });
      if (typeof (fCallback) == "function") {
        fCallback(res.data.body.list);
      }
    }, fail(res) {
      console.log(res);
      wx.showToast({
        title: '数据获取异常',
      })
    }
  })
}


function getMonthInfo(infoId, year, month) {
  var key = genMonthInfoKey(infoId, year, month);
  var monthInfo = wx.getStorageSync(key);
  // console.log("get month info from storage for "+year+"-"+month+", "+JSON.stringify(monthInfo));
  if (typeof(monthInfo) == "object" && monthInfo.length>0) {
    return monthInfo;
  } else {
    return null;
  }

};

function getSolarInfo(year) {
  var key = genSolarKey(year);
  var solarInfo = wx.getStorageSync(key);
  // console.log("get month info from storage for "+year+"-"+month+", "+JSON.stringify(monthInfo));
  if (typeof (solarInfo) == "object" && solarInfo.length > 0) {
    return solarInfo;
  } else {
    return null;
  }

};

function wrapInfo(info) {
  for (key in info) {
    if (key != "events" && info[key] == null) {
      info[key] = "";
    }
  }
  var evtGoods = [];
  var evtBads = [];
  for (var i = 0; i < eventCount; i++) {
    var key = "A" + util.formatNumber(i);
    if (info.events[key]) {
      switch (info.events[key]) {
        case 0:
          break;
        case 1:
          evtGoods.push(events[i].name);
          break;
        case 2:
          evtBads.push(events[i].name);
          break;
      }
    }
  }
  var luckValue = (evtGoods.length-evtBads.length)+info.luckV1+info.luckV2;
  if (luckValue <= -16) {
    info.luck = "大凶";
  } else if (luckValue <= -10) {
    info.luck = "小凶";
  } else if (luckValue <= 4) {
    info.luck = "平";
  } else if (luckValue <= 15) {
    info.luck = "小吉";
  } else {
    info.luck = "大吉";
  }

  if (evtGoods.length == eventCount) {
    info.evtGoods = ["诸事皆宜"];
  } else if (evtGoods.length > 0) {
    for (var i = 0; i < evtGoods.length - 1; i++) {
      evtGoods[i] = evtGoods[i] + "、"
    }
    info.evtGoods = evtGoods;
  } else {
    info.evtGoods = ["持斋修善"];
  }
  if (evtBads.length == eventCount) {
    info.evtBads = ["诸事不宜"];
  } else if (evtBads.length > 0) {
    for (var i = 0; i < evtBads.length - 1; i++) {
      evtBads[i] = evtBads[i] + "、"
    }
    info.evtBads = evtBads;
  } else {
    info.evtBads = ["诸吉事可为"];
  }

  if (info.extraInfo) {
    info.extraInfo = wrapInfo(info.extraInfo);
  }
  return info;
}

function getInfoByDate(year, month, day) {
  var userinfo = wx.getStorageSync(genCurUserinfoKey());
  var key = genMonthInfoKey(userinfo.id, year, month); 
  var monthInfo = wx.getStorageSync(key);
  if (monthInfo) {
    return wrapInfo(monthInfo[day-1]);
  } else {
    return null;
  }
}

function getPlaceData(fCallback) {
  var key = genCityDataKey();
  var placeData = wx.getStorageSync(key);
  if (typeof (placeData) == "object" && placeData.length > 0) {
    fCallback(placeData);
  } else {
    wx.request({
      url: hostname + '/static/json/citydata.json',
      success(res) {
        if (res.statusCode == 200) {
          wx.setStorageSync(key, res.data);
          fCallback(res.data);
        }
      }
    })
  }
}


module.exports = {
  genCurUserinfoKey: genCurUserinfoKey,
  getPlaceData: getPlaceData,
  getUser: getUser,
  fetchSmsCode: fetchSmsCode,
  getMainUserInfo: getMainUserInfo,
  createUserInfo: createUserInfo,
  updateUserInfo: updateUserInfo,
  unifiedOrder: unifiedOrder,
  succeedOrder: succeedOrder,
  getInfoByDate: getInfoByDate,
  loadMonthInfo: loadMonthInfo,
  loadSolarInfo: loadSolarInfo,
  wrapInfo: wrapInfo,
  events: events,
  eventsSel: eventsSel
}