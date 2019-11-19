import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {formatDate} from "./api/filters";
import Validate from "./api/validator";

import Toast from "@/components/toast/toast";
import Nodata from "@/components/nodata/nodata";
// import List from "@/components/list/list";
// import Cell from "@/components/cell/cell";
import ScrollView from "@/components/scrollview/scrollview";
import "./assets/base.css";

Vue.use(Nodata);
Vue.use(ScrollView);
// Vue.use(Cell);
// Vue.use(List);
Vue.prototype.$toast = Toast.install;
Vue.prototype.validate = function(type, value) { return Validate.validate(type, value) } //正则表达式
// this.validate('mobile', this.phone).result == false; 
// this.validate('mobile', this.phone).errorMessage;

Vue.config.productionTip = false;


// 保留两位小数
Vue.filter("num", function(data) {
  data = Math.round(data * 100) / 100;
  let strNum;
  let numArr = data.toString().split(".");
  if (numArr.length == 1) {
    strNum = `${data}.0`;
  } else {
    strNum = `${data}`;
  }
  return strNum;
});
// 控制文本的显示超过了用...表示
Vue.filter("name", function(name, num) {
  if (!name || name.length == 0) {
    return "";
  }
  if (name.length > num) {
    let str = name.substr(0, num - 2) + "...";
    return str;
  } else {
    return name;
  }
});

// 格式化时间
Vue.filter("time", function(value, type = 1) {
  let date = new Date(value);
  // let date = new Date(value * 1000);
  let midTime = "";
  switch (type) {
    case 1:
      midTime = formatDate(date, "yyyy-MM-dd hh:mm");
      break;
    case 2:
      midTime = formatDate(date, "yyyy-MM-dd");
      break;
    case 3:
      midTime = formatDate(date, "hh:mm");
      break;
    case 4:
      midTime = formatDate(date, "yyyy.MM.dd");
      break;
  }
  return midTime;
});

// 获取字符的个数
Vue.filter("getLen", function(val) {
  var str = new String(val);
  var bytesCount = 0;
  for (var i = 0, n = str.length; i < n; i++) {
    var c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      bytesCount += 1;
    } else {
      bytesCount += 2;
    }
  }
  return bytesCount;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
