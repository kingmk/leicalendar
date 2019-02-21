

var calCommonService = require('../../service/calCommonService.js');


Component({
  /**
   * 组件的属性列表
   */
  behaviors: ["wx://form-field"],

  properties: {
    value: {
      type: "Object",
      value: null
    },
    disabled: {
      type: "Boolean",
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    placeData: null,
    placeIndex: null,
    placeArray: null,
    placeSelect: null,
    placeTxt: "请选择",
    style: "placeholder"
  },

  ready: function() {
    var self = this;
    calCommonService.getPlaceData(function (placeData) {
      self.data.placeData = placeData;
      var provinceNames = new Array();
      for (var i = 0; i < placeData.length; i++) {
        provinceNames.push(placeData[i].fullname);
      }
      self.data.provinceNames = provinceNames;
      var v = [8, 0, 0];
      self.updateSelect(v);
      // self.selectPlace(v);

    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateByPlace: function(place) {
      var province = place.province;
      var city = place.city;
      var area = place.area;

      var self = this;
      var f = function() {
        var index = [];
        for (var i = 0; i < self.data.placeData.length; i++ ){
          if (self.data.placeData[i].fullname == province) {
            index[0] = i;
            var cities = self.data.placeData[i].cities;
            for (var j = 0; j<cities.length; j++) {
              if (cities[j].fullname == city) {
                index[1] = j;
                var areas = cities[j].areas;
                for (var k = 0; k<areas.length; k++) {
                  if (areas[k].fullname == area) {
                    index[2] = k;
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
        self.updateSelect(index);
        self.selectPlace(index);
      }

      var timer = setInterval(function() {
        if (self.data.placeData != null) {
          f();
          clearInterval(timer);
        }
      }, 200);
    },

    updateSelect: function (value) {
      this.data.placeIndex = value;
      var cities = this.data.placeData[value[0]].cities;
      var areas = cities[value[1]].areas;
      var cityNames = new Array();
      var areaNames = new Array();
      for (var i=0; i<cities.length; i++ ){
        cityNames.push(cities[i].fullname);
      }
      for (var i = 0; i < areas.length; i++) {
        areaNames.push(areas[i].fullname);
      }
      this.setData({
        placeArray: [this.data.provinceNames, cityNames, areaNames],
        placeIndex: value
      })
    },

    selectPlace: function(v) {
      this.data.placeIndex = v;
      var province = this.data.placeData[v[0]];
      var city = province.cities[v[1]];
      var area = city.areas[v[2]];
      var placeSelect = {
        province: {
          id: province.id,
          fullname: province.fullname
        },
        city: {
          id: city.id,
          fullname: city.fullname
        },
        area: {
          id: area.id,
          fullname: area.fullname,
          location: area.location
        }
      }
      this.setData({
        placeSelect: placeSelect,
        value: placeSelect,
        placeTxt: placeSelect.province.fullname+" "+placeSelect.city.fullname+" "+placeSelect.area.fullname,
        style: ""
      })

      this.triggerEvent("selectPlace", placeSelect);
    },

    onSelectChange: function(e) {
      this.selectPlace(e.detail.value);
    },
    onColumnChange: function(e) {
      // console.log(e.detail.column);
      // console.log(e.detail.value);
      var column = e.detail.column;
      var value = e.detail.value;
      if (column == 0) {
        this.updateSelect([value, 0, 0]);
      } else if (column == 1) {
        this.updateSelect([this.data.placeIndex[0], value, 0]);
      } else {
        this.data.placeIndex[2] = value;
        this.setData({
          placeIndex: this.data.placeIndex
        })
      }
    }
  }
})
